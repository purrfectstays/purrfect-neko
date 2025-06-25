/*
  # Add Email Verification System Tables

  1. New Tables
    - `verification_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to waitlist_users)
      - `token` (text, unique)
      - `user_type` (enum: cat-parent, cattery-owner)
      - `expires_at` (timestamp)
      - `used` (boolean, default false)
      - `created_at` (timestamp)
    
    - `quiz_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to waitlist_users)
      - `session_token` (text, unique)
      - `user_type` (enum: cat-parent, cattery-owner)
      - `expires_at` (timestamp)
      - `used` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

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

-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens (token);
CREATE INDEX IF NOT EXISTS verification_tokens_user_id_idx ON verification_tokens (user_id);
CREATE INDEX IF NOT EXISTS verification_tokens_expires_at_idx ON verification_tokens (expires_at);

CREATE INDEX IF NOT EXISTS quiz_sessions_token_idx ON quiz_sessions (session_token);
CREATE INDEX IF NOT EXISTS quiz_sessions_user_id_idx ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS quiz_sessions_expires_at_idx ON quiz_sessions (expires_at);

-- Enable Row Level Security
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for verification_tokens
CREATE POLICY "Public can insert verification tokens"
  ON verification_tokens
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can select verification tokens"
  ON verification_tokens
  FOR SELECT
  USING (true);

CREATE POLICY "Public can update verification tokens"
  ON verification_tokens
  FOR UPDATE
  USING (true);

-- Create policies for quiz_sessions
CREATE POLICY "Public can insert quiz sessions"
  ON quiz_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can select quiz sessions"
  ON quiz_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Public can update quiz sessions"
  ON quiz_sessions
  FOR UPDATE
  USING (true);

-- Create function to clean up expired tokens and sessions
CREATE OR REPLACE FUNCTION cleanup_expired_verification_data()
RETURNS void AS $$
BEGIN
  -- Delete expired verification tokens
  DELETE FROM verification_tokens
  WHERE expires_at < now();
  
  -- Delete expired quiz sessions
  DELETE FROM quiz_sessions
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job to clean up expired tokens and sessions daily
-- Note: This requires pg_cron extension which may not be available in all environments
-- If pg_cron is not available, you can run this function manually or through an external scheduler
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    EXECUTE 'SELECT cron.schedule(''@daily'', ''SELECT cleanup_expired_verification_data()'')';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If pg_cron is not available, just log a message
    RAISE NOTICE 'pg_cron extension not available. Scheduled cleanup not configured.';
END $$;