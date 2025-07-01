-- GDPR Compliance Tables and Policies
-- Date: 2025-07-01
-- Description: Add tables and policies for GDPR compliance

-- Table for tracking data export requests
CREATE TABLE IF NOT EXISTS data_export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Table for storing exported data
CREATE TABLE IF NOT EXISTS data_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES data_export_requests(id) ON DELETE CASCADE,
  email text NOT NULL,
  export_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days') -- Auto-delete after 30 days
);

-- Table for tracking data deletion requests
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, -- May be null if user already deleted
  email text NOT NULL,
  reason text,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  requested_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table for storing user consent preferences
CREATE TABLE IF NOT EXISTS user_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  analytics_consent boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  essential_consent boolean DEFAULT true, -- Always true, can't be disabled
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all GDPR tables
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;

-- Policies for data_export_requests
CREATE POLICY "Users can create export requests for own email"
  ON data_export_requests
  FOR INSERT
  WITH CHECK (true); -- Allow anyone to request, but we'll validate email ownership

CREATE POLICY "Users can read own export requests"
  ON data_export_requests
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policies for data_exports
CREATE POLICY "Users can read own data exports"
  ON data_exports
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policies for data_deletion_requests
CREATE POLICY "Users can create deletion requests for own email"
  ON data_deletion_requests
  FOR INSERT
  WITH CHECK (true); -- Allow anyone to request, but we'll validate email ownership

CREATE POLICY "Users can read own deletion requests"
  ON data_deletion_requests
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policies for user_consent
CREATE POLICY "Users can manage own consent"
  ON user_consent
  FOR ALL
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Function to automatically delete expired data exports
CREATE OR REPLACE FUNCTION cleanup_expired_exports()
RETURNS void AS $$
BEGIN
  DELETE FROM data_exports 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to anonymize user data instead of deletion (alternative to full deletion)
CREATE OR REPLACE FUNCTION anonymize_user_data(user_email text)
RETURNS void AS $$
DECLARE
  user_record waitlist_users%ROWTYPE;
BEGIN
  -- Get user record
  SELECT * INTO user_record FROM waitlist_users WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Anonymize personal data
  UPDATE waitlist_users 
  SET 
    name = 'Anonymous User',
    email = 'anonymous_' || user_record.id || '@deleted.local',
    verification_token = NULL,
    updated_at = NOW()
  WHERE id = user_record.id;
  
  -- Remove quiz responses (or anonymize them)
  DELETE FROM quiz_responses WHERE user_id = user_record.id;
  
  -- Log the anonymization
  INSERT INTO data_deletion_requests (
    user_id, 
    email, 
    reason, 
    status, 
    completed_at
  ) VALUES (
    user_record.id,
    user_email,
    'Data anonymization requested',
    'completed',
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add data retention policies
-- Auto-delete unverified users after 30 days
CREATE OR REPLACE FUNCTION cleanup_unverified_users()
RETURNS void AS $$
BEGIN
  DELETE FROM waitlist_users 
  WHERE is_verified = false 
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-delete old verification tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_tokens 
  WHERE expires_at < NOW();
  
  DELETE FROM quiz_sessions 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule regular cleanup (this would typically be done via cron or scheduled tasks)
-- For demonstration purposes, we're creating the functions here

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_data_export_requests_email ON data_export_requests(email);
CREATE INDEX IF NOT EXISTS idx_data_exports_email ON data_exports(email);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_email ON data_deletion_requests(email);
CREATE INDEX IF NOT EXISTS idx_user_consent_email ON user_consent(email);
CREATE INDEX IF NOT EXISTS idx_data_exports_expires_at ON data_exports(expires_at);

-- Add comments for documentation
COMMENT ON TABLE data_export_requests IS 'Tracks GDPR data export requests from users';
COMMENT ON TABLE data_exports IS 'Stores exported user data with automatic expiration';
COMMENT ON TABLE data_deletion_requests IS 'Tracks GDPR data deletion/anonymization requests';
COMMENT ON TABLE user_consent IS 'Stores user consent preferences for different data processing purposes';

COMMENT ON FUNCTION cleanup_expired_exports IS 'Automatically removes expired data exports to comply with data minimization';
COMMENT ON FUNCTION anonymize_user_data IS 'Anonymizes user data as an alternative to full deletion';
COMMENT ON FUNCTION cleanup_unverified_users IS 'Removes unverified users after retention period';
COMMENT ON FUNCTION cleanup_expired_tokens IS 'Removes expired verification and session tokens';