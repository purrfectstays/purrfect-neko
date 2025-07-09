-- Add Missing Tables for Verification System
-- Date: 2025-01-07
-- Purpose: Add verification_tokens table missing from fresh project setup

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_sessions table (also missing)
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens (token);
CREATE INDEX IF NOT EXISTS verification_tokens_user_id_idx ON verification_tokens (user_id);
CREATE INDEX IF NOT EXISTS verification_tokens_expires_at_idx ON verification_tokens (expires_at);

CREATE INDEX IF NOT EXISTS quiz_sessions_token_idx ON quiz_sessions (session_token);
CREATE INDEX IF NOT EXISTS quiz_sessions_user_id_idx ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS quiz_sessions_expires_at_idx ON quiz_sessions (expires_at);

-- Enable Row Level Security
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for verification_tokens
CREATE POLICY "service_role_full_access_verification_tokens"
ON verification_tokens FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

CREATE POLICY "public_read_verification_tokens"
ON verification_tokens FOR SELECT
USING (NOT is_service_role());

-- Add RLS policies for quiz_sessions  
CREATE POLICY "service_role_full_access_quiz_sessions"
ON quiz_sessions FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

CREATE POLICY "public_read_quiz_sessions"
ON quiz_sessions FOR SELECT
USING (NOT is_service_role());