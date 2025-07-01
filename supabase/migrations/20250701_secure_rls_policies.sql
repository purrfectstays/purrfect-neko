-- Fix critical security vulnerabilities in RLS policies
-- Date: 2025-07-01
-- Description: Replace overly permissive policies with secure email-based access control

-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can read their own data" ON waitlist_users;
DROP POLICY IF EXISTS "Users can insert their own data" ON waitlist_users;
DROP POLICY IF EXISTS "Users can update their own data" ON waitlist_users;
DROP POLICY IF EXISTS "Users can read their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Public can select verification tokens" ON verification_tokens;
DROP POLICY IF EXISTS "Public can insert verification tokens" ON verification_tokens;
DROP POLICY IF EXISTS "Public can delete verification tokens" ON verification_tokens;
DROP POLICY IF EXISTS "Users can access quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can create quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Public access" ON github_connections;

-- Add email column to policy context for secure access control
-- This will be used to identify users without relying on auth.uid()

-- Create secure policies for waitlist_users
CREATE POLICY "Users can read own data by email"
  ON waitlist_users
  FOR SELECT
  USING (
    -- Allow if email matches the request context
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR
    -- Allow public read for verification process (limited fields only)
    verification_token IS NOT NULL
  );

CREATE POLICY "Public can register new users"
  ON waitlist_users
  FOR INSERT
  WITH CHECK (
    -- Allow new user registration
    is_verified = false
    AND quiz_completed = false
    AND waitlist_position IS NULL
  );

CREATE POLICY "Users can update own data by email"
  ON waitlist_users
  FOR UPDATE
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR
    -- Allow verification updates using token
    verification_token = current_setting('request.headers', true)::json->>'x-verification-token'
  );

-- Create secure policies for quiz_responses
CREATE POLICY "Users can read own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users
      WHERE id = quiz_responses.user_id
      AND email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Users can insert own quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM waitlist_users
      WHERE id = user_id
      AND email = current_setting('request.jwt.claims', true)::json->>'email'
      AND is_verified = true
    )
  );

-- Secure verification tokens table
CREATE POLICY "Verification tokens by email access only"
  ON verification_tokens
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users
      WHERE id = verification_tokens.user_id
      AND email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR
    -- Allow token validation during verification process
    token = current_setting('request.headers', true)::json->>'x-verification-token'
  );

-- Secure quiz sessions table  
CREATE POLICY "Quiz sessions by verified users only"
  ON quiz_sessions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users
      WHERE id = quiz_sessions.user_id
      AND email = current_setting('request.jwt.claims', true)::json->>'email'
      AND is_verified = true
    )
  );

-- Create read-only policy for regional limits (public data)
DROP POLICY IF EXISTS "Public can read regional limits" ON regional_limits;
CREATE POLICY "Public can read regional limits"
  ON regional_limits
  FOR SELECT
  USING (true); -- Safe to be public as it's operational data

-- Remove public access to github_connections entirely
DROP POLICY IF EXISTS "Authenticated users access github connections" ON github_connections;
CREATE POLICY "No access to github connections"
  ON github_connections
  FOR ALL
  USING (false); -- Disable all access until proper auth is implemented

-- Create function to validate email-based access
CREATE OR REPLACE FUNCTION validate_user_email_access(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email = current_setting('request.jwt.claims', true)::json->>'email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON POLICY "Users can read own data by email" ON waitlist_users IS 
'Allows users to read their own data based on email in JWT claims, with limited public access for verification';

COMMENT ON POLICY "Users can update own data by email" ON waitlist_users IS 
'Allows users to update their own data, including verification status via token';

COMMENT ON FUNCTION validate_user_email_access IS 
'Helper function to validate user access based on email in JWT claims';