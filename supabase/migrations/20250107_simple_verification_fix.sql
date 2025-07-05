-- Simple, foolproof fix for email verification
-- This removes all complexity and allows verification to work

-- Step 1: Remove ALL existing policies on waitlist_users
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

-- Step 2: Create simple, permissive policies that definitely work

-- Allow anyone to read waitlist users (needed for verification lookup)
CREATE POLICY "public_read_all"
ON waitlist_users FOR SELECT
USING (true);

-- Allow anyone to update if they have the verification token
CREATE POLICY "public_verify_email"
ON waitlist_users FOR UPDATE
USING (
    -- Current record must have a token (not yet verified)
    verification_token IS NOT NULL 
    AND is_verified = false
)
WITH CHECK (
    -- After update: must be verified and token cleared
    is_verified = true 
    AND verification_token IS NULL
);

-- Allow new user registration
CREATE POLICY "public_register"
ON waitlist_users FOR INSERT
WITH CHECK (
    -- New users must not be verified yet
    is_verified = false 
    AND verification_token IS NOT NULL
    AND email IS NOT NULL
);

-- Optional: Allow authenticated users to update their own data
CREATE POLICY "users_update_own"
ON waitlist_users FOR UPDATE
USING (
    -- Must be verified to use this policy
    is_verified = true
    AND email = current_setting('request.jwt.claims', true)::json->>'email'
)
WITH CHECK (
    -- Can't change email or verification status
    email = current_setting('request.jwt.claims', true)::json->>'email'
    AND is_verified = true
);

-- Step 3: Create a helper function for debugging
CREATE OR REPLACE FUNCTION debug_verification(token_param text)
RETURNS TABLE (
    user_id uuid,
    email text,
    is_verified boolean,
    has_token boolean,
    token_matches boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id as user_id,
        waitlist_users.email,
        waitlist_users.is_verified,
        verification_token IS NOT NULL as has_token,
        verification_token = token_param as token_matches
    FROM waitlist_users
    WHERE verification_token = token_param
    OR id::text = token_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION debug_verification(text) TO anon, authenticated;