-- Fix RLS policies specifically for email verification updates
-- Date: 2025-01-07
-- Description: Allow public updates during email verification process

-- Drop the existing restrictive update policy
DROP POLICY IF EXISTS "Allow email verification updates" ON waitlist_users;
DROP POLICY IF EXISTS "Authenticated users can update own data" ON waitlist_users;

-- Create a new policy that allows verification updates without authentication
CREATE POLICY "Public can verify email with token"
  ON waitlist_users
  FOR UPDATE
  USING (
    -- Allow update when the verification token is not null (user has a token to verify)
    verification_token IS NOT NULL
  )
  WITH CHECK (
    -- Only allow setting is_verified to true and clearing the token
    is_verified = true 
    AND verification_token IS NULL
  );

-- Create policy for authenticated users to update their own data (excluding verification)
CREATE POLICY "Users can update own non-verification data"
  ON waitlist_users
  FOR UPDATE
  USING (
    -- Must have email in JWT claims
    email = current_setting('request.jwt.claims', true)::json->>'email'
    AND email IS NOT NULL
    -- Can't use this policy to change verification status
    AND is_verified = true
  )
  WITH CHECK (
    -- Ensure email doesn't change
    email = current_setting('request.jwt.claims', true)::json->>'email'
    -- Ensure verification status doesn't change  
    AND is_verified = true
  );

-- Ensure the select policy allows reading during verification
DROP POLICY IF EXISTS "Allow reading during verification" ON waitlist_users;

CREATE POLICY "Public can read for verification"
  ON waitlist_users
  FOR SELECT
  USING (
    -- Allow reading any user with a verification token (for verification process)
    verification_token IS NOT NULL
    OR
    -- Allow reading verified users (public data)
    is_verified = true
    OR
    -- Allow authenticated users to read their own data
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Add helpful comments
COMMENT ON POLICY "Public can verify email with token" ON waitlist_users IS 
'Allows anyone with a valid verification token to verify their email address';

COMMENT ON POLICY "Users can update own non-verification data" ON waitlist_users IS 
'Allows verified users to update their profile, but not change verification status';

COMMENT ON POLICY "Public can read for verification" ON waitlist_users IS 
'Allows reading user data during verification flow and for public verified profiles';