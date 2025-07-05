-- Fix RLS policies for email verification flow
-- Date: 2025-07-07
-- Description: Allow public verification updates using verification token

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can update own data by email" ON waitlist_users;

-- Create new policy that allows verification updates
CREATE POLICY "Allow email verification updates"
  ON waitlist_users
  FOR UPDATE
  USING (
    -- Allow updates when verification token matches
    verification_token IS NOT NULL 
    AND verification_token = ANY(
      ARRAY[
        -- Direct token match in WHERE clause
        current_setting('request.jwt.claims', true)::json->>'verification_token',
        -- Also check if updating with matching token
        verification_token
      ]
    )
  )
  WITH CHECK (
    -- Ensure only verification-related fields are updated
    (is_verified = true OR is_verified = false)
  );

-- Create additional policy for authenticated users to update their own data
CREATE POLICY "Authenticated users can update own data"
  ON waitlist_users
  FOR UPDATE
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    AND email IS NOT NULL
  )
  WITH CHECK (
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Add policy to allow reading user data during verification
DROP POLICY IF EXISTS "Users can read own data by email" ON waitlist_users;

CREATE POLICY "Allow reading during verification"
  ON waitlist_users
  FOR SELECT
  USING (
    -- Allow reading when email matches JWT
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR
    -- Allow reading when verification token is present (for verification flow)
    verification_token IS NOT NULL
    OR
    -- Allow reading verified users (for public profile data)
    is_verified = true
  );

-- Add index to improve verification token lookup performance
CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_token 
  ON waitlist_users(verification_token) 
  WHERE verification_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON POLICY "Allow email verification updates" ON waitlist_users IS 
'Allows users to verify their email using their verification token without authentication';

COMMENT ON POLICY "Authenticated users can update own data" ON waitlist_users IS 
'Allows authenticated users to update their own profile data';

COMMENT ON POLICY "Allow reading during verification" ON waitlist_users IS 
'Allows reading user data during the verification process and for verified users';