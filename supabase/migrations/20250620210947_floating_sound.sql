/*
  # Fix Email Verification System

  1. Ensure Verification Tables
    - Verify `verification_tokens` table exists
    - Verify `quiz_sessions` table exists
    - Add missing indexes if needed

  2. Security
    - Ensure RLS policies are properly configured
*/

-- Ensure verification_tokens table exists
CREATE TABLE IF NOT EXISTS verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Ensure quiz_sessions table exists
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for faster lookups if they don't exist
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens (token);
CREATE INDEX IF NOT EXISTS verification_tokens_user_id_idx ON verification_tokens (user_id);
CREATE INDEX IF NOT EXISTS verification_tokens_expires_at_idx ON verification_tokens (expires_at);

CREATE INDEX IF NOT EXISTS quiz_sessions_token_idx ON quiz_sessions (session_token);
CREATE INDEX IF NOT EXISTS quiz_sessions_user_id_idx ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS quiz_sessions_expires_at_idx ON quiz_sessions (expires_at);

-- Enable Row Level Security if not already enabled
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist for verification_tokens
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verification_tokens' AND policyname = 'Public can insert verification tokens'
  ) THEN
    CREATE POLICY "Public can insert verification tokens"
      ON verification_tokens
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verification_tokens' AND policyname = 'Public can select verification tokens'
  ) THEN
    CREATE POLICY "Public can select verification tokens"
      ON verification_tokens
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verification_tokens' AND policyname = 'Public can update verification tokens'
  ) THEN
    CREATE POLICY "Public can update verification tokens"
      ON verification_tokens
      FOR UPDATE
      USING (true);
  END IF;
END $$;

-- Ensure policies exist for quiz_sessions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_sessions' AND policyname = 'Public can insert quiz sessions'
  ) THEN
    CREATE POLICY "Public can insert quiz sessions"
      ON quiz_sessions
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_sessions' AND policyname = 'Public can select quiz sessions'
  ) THEN
    CREATE POLICY "Public can select quiz sessions"
      ON quiz_sessions
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_sessions' AND policyname = 'Public can update quiz sessions'
  ) THEN
    CREATE POLICY "Public can update quiz sessions"
      ON quiz_sessions
      FOR UPDATE
      USING (true);
  END IF;
END $$;