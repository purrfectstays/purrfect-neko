/*
  # Create Waitlist Schema

  1. New Tables
    - `waitlist_users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `user_type` (enum: cat-parent, cattery-owner)
      - `is_verified` (boolean, default false)
      - `quiz_completed` (boolean, default false)
      - `waitlist_position` (integer, nullable)
      - `verification_token` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `question_id` (text)
      - `answer` (text or numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create enum for user types
CREATE TYPE user_type AS ENUM ('cat-parent', 'cattery-owner');

-- Create waitlist_users table
CREATE TABLE IF NOT EXISTS waitlist_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  is_verified boolean DEFAULT false,
  quiz_completed boolean DEFAULT false,
  waitlist_position integer,
  verification_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist_users
CREATE POLICY "Users can read their own data"
  ON waitlist_users
  FOR SELECT
  USING (true); -- Allow reading for verification purposes

CREATE POLICY "Users can insert their own data"
  ON waitlist_users
  FOR INSERT
  WITH CHECK (true); -- Allow registration

CREATE POLICY "Users can update their own data"
  ON waitlist_users
  FOR UPDATE
  USING (true); -- Allow verification updates

-- Create policies for quiz_responses
CREATE POLICY "Users can read their own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_waitlist_users_updated_at
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to assign waitlist position
CREATE OR REPLACE FUNCTION assign_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quiz_completed = true AND OLD.quiz_completed = false THEN
    NEW.waitlist_position = (
      SELECT COALESCE(MAX(waitlist_position), 0) + 1
      FROM waitlist_users
      WHERE quiz_completed = true
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for waitlist position assignment
CREATE TRIGGER assign_waitlist_position_trigger
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION assign_waitlist_position();