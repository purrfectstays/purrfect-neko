/*
  # Add GitHub Connections Schema

  1. New Tables
    - `github_connections`
      - `id` (uuid, primary key)
      - `repository_url` (text)
      - `repository_owner` (text)
      - `repository_name` (text)
      - `branch` (text)
      - `auth_method` (text)
      - `access_level` (text)
      - `credentials` (jsonb)
      - `webhook_config` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on github_connections table
    - Add policies for secure access
*/

-- Create github_connections table
CREATE TABLE IF NOT EXISTS github_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_url text NOT NULL,
  repository_owner text NOT NULL,
  repository_name text NOT NULL,
  branch text NOT NULL DEFAULT 'main',
  auth_method text NOT NULL CHECK (auth_method IN ('https', 'ssh')),
  access_level text NOT NULL CHECK (access_level IN ('read-only', 'read-write')),
  credentials jsonb NOT NULL,
  webhook_config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS github_connections_repo_idx ON github_connections (repository_owner, repository_name);
CREATE INDEX IF NOT EXISTS github_connections_created_at_idx ON github_connections (created_at);

-- Enable Row Level Security
ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for github_connections
CREATE POLICY "Public can select github connections"
  ON github_connections
  FOR SELECT
  USING (true);

CREATE POLICY "Public can insert github connections"
  ON github_connections
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update github connections"
  ON github_connections
  FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete github connections"
  ON github_connections
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_github_connections_updated_at
  BEFORE UPDATE ON github_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();