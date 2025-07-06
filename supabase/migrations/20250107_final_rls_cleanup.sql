-- Final RLS cleanup - Email verification now handled server-side
-- Date: 2025-01-07
-- Description: Clean, simple RLS policies for normal operations only

-- Remove ALL existing policies on waitlist_users
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'waitlist_users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist_users', pol.policyname);
    END LOOP;
END $$;

-- Create clean, simple policies for normal operations

-- 1. Allow public reading (for registration checks and public profiles)
CREATE POLICY "public_read_access"
ON waitlist_users FOR SELECT
USING (true);

-- 2. Allow new user registration
CREATE POLICY "public_can_register"
ON waitlist_users FOR INSERT
WITH CHECK (
    -- New users must not be verified yet and must have basic required fields
    is_verified = false 
    AND verification_token IS NOT NULL
    AND email IS NOT NULL
    AND name IS NOT NULL
    AND user_type IN ('cat-parent', 'cattery-owner')
);

-- 3. Allow verified users to update their own non-critical data
CREATE POLICY "verified_users_update_profile"
ON waitlist_users FOR UPDATE
USING (
    -- Must be verified and updating their own record
    is_verified = true
    AND email = current_setting('request.jwt.claims', true)::json->>'email'
    AND email IS NOT NULL
)
WITH CHECK (
    -- Cannot change critical fields
    email = current_setting('request.jwt.claims', true)::json->>'email'
    AND is_verified = true  -- Cannot unverify themselves
    AND verification_token IS NULL  -- Cannot set verification token
);

-- 4. Quiz responses - only verified users can manage their own
CREATE POLICY "verified_users_manage_quiz"
ON quiz_responses FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = quiz_responses.user_id
        AND email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_verified = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = user_id
        AND email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_verified = true
    )
);

-- 5. Verification tokens - read-only for cleanup purposes
CREATE POLICY "read_only_verification_tokens"
ON verification_tokens FOR SELECT
USING (true);

-- 6. Quiz sessions - only for verified users
CREATE POLICY "verified_users_quiz_sessions"
ON quiz_sessions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = quiz_sessions.user_id
        AND email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_verified = true
    )
);

-- Add helpful comments
COMMENT ON POLICY "public_read_access" ON waitlist_users IS 
'Allows reading user data for registration checks and public profiles';

COMMENT ON POLICY "public_can_register" ON waitlist_users IS 
'Allows anyone to register with proper validation';

COMMENT ON POLICY "verified_users_update_profile" ON waitlist_users IS 
'Allows verified users to update their own profile data only';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email_verified 
ON waitlist_users(email) WHERE is_verified = true;

CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_status 
ON waitlist_users(is_verified, created_at);

-- Add a function to check RLS status
CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policy_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'waitlist_users'::text,
        relrowsecurity,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'waitlist_users')
    FROM pg_class 
    WHERE relname = 'waitlist_users';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_rls_status() TO anon, authenticated;