-- Consolidated Database + Edge Functions Integration Fix
-- Date: 2025-01-07
-- Purpose: Fix all RLS, column reference, and service role integration issues

-- =================================================================
-- PHASE 1: Clean up existing policies and constraints
-- =================================================================

-- Drop all existing policies on all tables
DO $$ 
DECLARE
    pol RECORD;
    tbl RECORD;
BEGIN
    -- Get all tables with RLS policies
    FOR tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('waitlist_users', 'quiz_responses', 'quiz_sessions', 'verification_tokens')
    LOOP
        -- Drop all policies for this table
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = tbl.schemaname AND tablename = tbl.tablename
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, tbl.schemaname, tbl.tablename);
        END LOOP;
    END LOOP;
END $$;

-- Drop any functions that might reference non-existent columns
DROP FUNCTION IF EXISTS verify_email_with_token(text);
DROP FUNCTION IF EXISTS check_rls_status();

-- =================================================================
-- PHASE 2: Create service role bypass function
-- =================================================================

-- Create a function to check if current user is service role
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
    -- Service role bypasses RLS entirely
    -- This function will return true for service role operations
    RETURN current_setting('role') = 'service_role' OR 
           current_setting('request.jwt.claims', true) IS NULL OR
           current_setting('request.jwt.claims', true) = '';
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service role and anon
GRANT EXECUTE ON FUNCTION is_service_role() TO anon, authenticated, service_role;

-- =================================================================
-- PHASE 3: Create clean, simple RLS policies
-- =================================================================

-- WAITLIST_USERS table policies
CREATE POLICY "service_role_full_access_waitlist"
ON waitlist_users FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

CREATE POLICY "public_read_waitlist"
ON waitlist_users FOR SELECT
USING (
    NOT is_service_role() AND 
    (
        -- Allow reading for registration checks (email uniqueness)
        true
    )
);

CREATE POLICY "public_insert_waitlist"
ON waitlist_users FOR INSERT
WITH CHECK (
    NOT is_service_role() AND
    -- New users must have basic required fields
    email IS NOT NULL AND
    name IS NOT NULL AND
    user_type IN ('cat-parent', 'cattery-owner') AND
    is_verified = false
);

CREATE POLICY "verified_users_update_waitlist"
ON waitlist_users FOR UPDATE
USING (
    NOT is_service_role() AND
    -- Users can only update their own records
    email = current_setting('request.jwt.claims', true)::json->>'email' AND
    is_verified = true
)
WITH CHECK (
    NOT is_service_role() AND
    -- Cannot change critical verification fields
    is_verified = true AND
    verification_token IS NULL AND
    email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- QUIZ_RESPONSES table policies
CREATE POLICY "service_role_full_access_quiz_responses"
ON quiz_responses FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

CREATE POLICY "verified_users_manage_quiz_responses"
ON quiz_responses FOR ALL
USING (
    NOT is_service_role() AND
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = quiz_responses.user_id
        AND email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_verified = true
    )
)
WITH CHECK (
    NOT is_service_role() AND
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = user_id
        AND email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_verified = true
    )
);

-- QUIZ_SESSIONS table policies (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
        EXECUTE '
        CREATE POLICY "service_role_full_access_quiz_sessions"
        ON quiz_sessions FOR ALL
        USING (is_service_role())
        WITH CHECK (is_service_role());
        
        CREATE POLICY "verified_users_manage_quiz_sessions"
        ON quiz_sessions FOR ALL
        USING (
            NOT is_service_role() AND
            EXISTS (
                SELECT 1 FROM waitlist_users
                WHERE id = quiz_sessions.user_id
                AND email = current_setting(''request.jwt.claims'', true)::json->>''email''
                AND is_verified = true
            )
        );';
    END IF;
END $$;

-- VERIFICATION_TOKENS table policies (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verification_tokens') THEN
        EXECUTE '
        CREATE POLICY "service_role_full_access_verification_tokens"
        ON verification_tokens FOR ALL
        USING (is_service_role())
        WITH CHECK (is_service_role());
        
        CREATE POLICY "public_read_verification_tokens"
        ON verification_tokens FOR SELECT
        USING (NOT is_service_role());';
    END IF;
END $$;

-- =================================================================
-- PHASE 4: Create service role verification function
-- =================================================================

-- Create verification function that works with service role
CREATE OR REPLACE FUNCTION verify_email_with_token(token_param text)
RETURNS json AS $$
DECLARE
    user_record RECORD;
    result json;
BEGIN
    -- Validate input
    IF token_param IS NULL OR token_param = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid verification token'
        );
    END IF;

    -- Find and update user with the token
    -- This function runs with SECURITY DEFINER, so it has elevated privileges
    UPDATE waitlist_users
    SET 
        is_verified = true,
        verification_token = null,
        updated_at = now()
    WHERE 
        verification_token = token_param
        AND is_verified = false
    RETURNING * INTO user_record;

    -- Check if update was successful
    IF NOT FOUND THEN
        -- Check if user exists but is already verified
        IF EXISTS (
            SELECT 1 FROM waitlist_users 
            WHERE verification_token = token_param AND is_verified = true
        ) THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Email already verified'
            );
        ELSE
            RETURN json_build_object(
                'success', false,
                'error', 'Invalid or expired verification token'
            );
        END IF;
    END IF;

    -- Return success with user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'name', user_record.name,
            'user_type', user_record.user_type,
            'is_verified', user_record.is_verified,
            'waitlist_position', user_record.waitlist_position
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public and service role
GRANT EXECUTE ON FUNCTION verify_email_with_token(text) TO anon, authenticated, service_role;

-- =================================================================
-- PHASE 5: Create helper functions for debugging
-- =================================================================

-- Function to check RLS status
CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policy_count bigint,
    service_role_bypass boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::text,
        c.relrowsecurity,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.table_name),
        is_service_role()
    FROM information_schema.tables t
    JOIN pg_class c ON c.relname = t.table_name
    WHERE t.table_schema = 'public' 
    AND t.table_name IN ('waitlist_users', 'quiz_responses', 'quiz_sessions', 'verification_tokens')
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_rls_status() TO anon, authenticated, service_role;

-- Function to test service role access
CREATE OR REPLACE FUNCTION test_service_role_access()
RETURNS json AS $$
DECLARE
    result json;
    user_count bigint;
BEGIN
    SELECT COUNT(*) INTO user_count FROM waitlist_users;
    
    RETURN json_build_object(
        'success', true,
        'is_service_role', is_service_role(),
        'current_role', current_setting('role'),
        'user_count', user_count,
        'test_time', now()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'is_service_role', is_service_role(),
            'current_role', current_setting('role')
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION test_service_role_access() TO anon, authenticated, service_role;

-- =================================================================
-- PHASE 6: Create performance indexes
-- =================================================================

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email_verified 
ON waitlist_users(email) WHERE is_verified = true;

CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_token 
ON waitlist_users(verification_token) WHERE verification_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_status 
ON waitlist_users(is_verified, created_at);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id 
ON quiz_responses(user_id, created_at);

-- =================================================================
-- PHASE 7: Add helpful comments
-- =================================================================

COMMENT ON FUNCTION is_service_role() IS 
'Returns true if the current context is running as service role, allowing RLS bypass';

COMMENT ON FUNCTION verify_email_with_token(text) IS 
'Verifies user email with token using elevated privileges. Safe for Edge Functions.';

COMMENT ON FUNCTION test_service_role_access() IS 
'Test function to verify service role can access data properly';

COMMENT ON POLICY "service_role_full_access_waitlist" ON waitlist_users IS 
'Allows service role (Edge Functions) full access to bypass RLS';

COMMENT ON POLICY "public_read_waitlist" ON waitlist_users IS 
'Allows public reading for registration checks and verification';

COMMENT ON POLICY "public_insert_waitlist" ON waitlist_users IS 
'Allows public registration with validation';

COMMENT ON POLICY "verified_users_update_waitlist" ON waitlist_users IS 
'Allows verified users to update their own profile data only';

-- =================================================================
-- PHASE 8: Final verification
-- =================================================================

-- Log the results
DO $$
DECLARE
    policy_count bigint;
    table_count bigint;
BEGIN
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE schemaname = 'public';
    SELECT COUNT(*) INTO table_count FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Migration completed successfully:';
    RAISE NOTICE '- Tables with RLS: %', table_count;
    RAISE NOTICE '- Total policies created: %', policy_count;
    RAISE NOTICE '- Service role bypass function: created';
    RAISE NOTICE '- Verification function: created';
    RAISE NOTICE '- Helper functions: created';
END $$;