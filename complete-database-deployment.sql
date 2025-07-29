-- PURRFECT STAYS - COMPLETE DATABASE DEPLOYMENT
-- BMad Orchestrator - Nuclear Option Database Setup
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR

-- =================================================================
-- PHASE 1: CREATE CORE TYPES AND TABLES
-- =================================================================

-- Create user type enum
CREATE TYPE user_type AS ENUM ('cat-parent', 'cattery-owner');

-- Create waitlist_users table (main table)
CREATE TABLE IF NOT EXISTS waitlist_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  is_verified boolean DEFAULT false,
  quiz_completed boolean DEFAULT false,
  waitlist_position integer,
  verification_token text,
  -- Geographic tracking columns
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  country_code VARCHAR(3),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone VARCHAR(50),
  regional_position INTEGER,
  -- Referral system columns
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES waitlist_users(id),
  referral_count INTEGER DEFAULT 0,
  -- Timestamps
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

-- Create referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_id UUID REFERENCES waitlist_users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  -- Ensure a user can't refer the same email twice
  UNIQUE(referrer_id, referred_email)
);

-- Create regional_limits table for geographic urgency
CREATE TABLE IF NOT EXISTS regional_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(3) NOT NULL,
  total_spots INTEGER NOT NULL DEFAULT 50,
  remaining_spots INTEGER NOT NULL DEFAULT 50,
  current_registrations INTEGER NOT NULL DEFAULT 0,
  urgency_level VARCHAR(10) NOT NULL DEFAULT 'low' CHECK (urgency_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(country_code)
);

-- =================================================================
-- PHASE 2: CREATE ESSENTIAL FUNCTIONS
-- =================================================================

-- Service role detection function (CRITICAL for RLS bypass)
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
    -- Service role bypasses RLS entirely
    RETURN current_setting('role') = 'service_role' OR 
           current_setting('request.jwt.claims', true) IS NULL OR
           current_setting('request.jwt.claims', true) = '';
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_service_role() TO anon, authenticated, service_role;

-- Email verification function (for Edge Functions)
CREATE OR REPLACE FUNCTION verify_email_with_token(token_param text)
RETURNS json AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Validate input
    IF token_param IS NULL OR token_param = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid verification token'
        );
    END IF;

    -- Find and update user with the token (using SECURITY DEFINER privileges)
    UPDATE waitlist_users
    SET 
        is_verified = true,
        verification_token = null,
        updated_at = now()
    WHERE 
        verification_token = token_param
        AND is_verified = false
    RETURNING * INTO user_record;

    -- Check if update was successful
    IF NOT FOUND THEN
        -- Check if user exists but is already verified
        IF EXISTS (
            SELECT 1 FROM waitlist_users 
            WHERE verification_token = token_param AND is_verified = true
        ) THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Email already verified'
            );
        ELSE
            RETURN json_build_object(
                'success', false,
                'error', 'Invalid or expired verification token'
            );
        END IF;
    END IF;

    -- Return success with user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'name', user_record.name,
            'user_type', user_record.user_type,
            'is_verified', user_record.is_verified,
            'waitlist_position', user_record.waitlist_position
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION verify_email_with_token(text) TO anon, authenticated, service_role;

-- Submit quiz responses function
CREATE OR REPLACE FUNCTION submit_quiz_response(
    user_id_param UUID,
    responses JSONB
) RETURNS json AS $$
DECLARE
    response_record RECORD;
    quiz_count INTEGER;
BEGIN
    -- Validate that user exists and is verified
    IF NOT EXISTS (
        SELECT 1 FROM waitlist_users 
        WHERE id = user_id_param AND is_verified = true
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found or not verified'
        );
    END IF;

    -- Insert quiz responses
    FOR response_record IN 
        SELECT * FROM jsonb_each_text(responses)
    LOOP
        INSERT INTO quiz_responses (user_id, question_id, answer)
        VALUES (user_id_param, response_record.key, response_record.value)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Mark quiz as completed and assign waitlist position
    UPDATE waitlist_users
    SET 
        quiz_completed = true,
        waitlist_position = (
            SELECT COALESCE(MAX(waitlist_position), 0) + 1
            FROM waitlist_users
            WHERE quiz_completed = true
        ),
        updated_at = now()
    WHERE id = user_id_param;

    -- Get quiz response count
    SELECT COUNT(*) INTO quiz_count 
    FROM quiz_responses 
    WHERE user_id = user_id_param;

    RETURN json_build_object(
        'success', true,
        'quiz_responses_saved', quiz_count,
        'quiz_completed', true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION submit_quiz_response(UUID, JSONB) TO anon, authenticated, service_role;

-- Referral system functions
CREATE OR REPLACE FUNCTION apply_referral_boost(
  user_id UUID,
  boost_amount INTEGER
) RETURNS VOID AS $$
BEGIN
  -- Update referral count
  UPDATE waitlist_users 
  SET referral_count = referral_count + 1
  WHERE id = user_id;
  
  -- Apply position boost (move user up in waitlist)
  UPDATE waitlist_users 
  SET waitlist_position = GREATEST(1, waitlist_position - boost_amount)
  WHERE id = user_id;
  
  -- Adjust positions of users who were moved down
  UPDATE waitlist_users 
  SET waitlist_position = waitlist_position + 1
  WHERE waitlist_position >= (
    SELECT waitlist_position FROM waitlist_users WHERE id = user_id
  )
  AND id != user_id
  AND waitlist_position IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_referral_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_referrals', COUNT(*),
    'completed_referrals', COUNT(*) FILTER (WHERE status = 'completed'),
    'pending_referrals', COUNT(*) FILTER (WHERE status = 'pending'),
    'position_boost', COUNT(*) FILTER (WHERE status = 'completed') * 10
  )
  INTO stats
  FROM referrals
  WHERE referrer_id = user_id;
  
  RETURN COALESCE(stats, '{"total_referrals":0,"completed_referrals":0,"pending_referrals":0,"position_boost":0}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =================================================================
-- PHASE 3: CREATE TRIGGERS
-- =================================================================

-- Updated timestamp trigger
CREATE TRIGGER update_waitlist_users_updated_at
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- PHASE 4: ENABLE ROW LEVEL SECURITY
-- =================================================================

-- Enable RLS on all tables
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_limits ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- PHASE 5: CREATE RLS POLICIES
-- =================================================================

-- WAITLIST_USERS POLICIES

-- Service role full access (CRITICAL - allows Edge Functions to work)
CREATE POLICY "service_role_full_access_waitlist"
ON waitlist_users FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

-- Public read access (for registration checks and verification)
CREATE POLICY "public_read_waitlist"
ON waitlist_users FOR SELECT
USING (true);

-- Public insert (for new registrations)
CREATE POLICY "public_insert_waitlist"
ON waitlist_users FOR INSERT
WITH CHECK (
    NOT is_service_role() AND
    email IS NOT NULL AND
    name IS NOT NULL AND
    user_type IN ('cat-parent', 'cattery-owner') AND
    is_verified = false
);

-- QUIZ_RESPONSES POLICIES

-- Service role full access
CREATE POLICY "service_role_full_access_quiz_responses"
ON quiz_responses FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

-- Verified users can manage their quiz responses
CREATE POLICY "verified_users_manage_quiz_responses"
ON quiz_responses FOR ALL
USING (
    NOT is_service_role() AND
    EXISTS (
        SELECT 1 FROM waitlist_users
        WHERE id = quiz_responses.user_id
        AND is_verified = true
    )
);

-- REFERRALS POLICIES

-- Users can view their own referrals
CREATE POLICY "users_view_own_referrals" ON referrals
  FOR SELECT USING (
    referrer_id = auth.uid() OR 
    referred_id = auth.uid()
  );

-- Users can create referrals
CREATE POLICY "users_create_referrals" ON referrals
  FOR INSERT WITH CHECK (
    referrer_id = auth.uid()
  );

-- System can update referrals
CREATE POLICY "system_update_referrals" ON referrals
  FOR UPDATE USING (true);

-- Service role full access to referrals
CREATE POLICY "service_role_full_access_referrals"
ON referrals FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

-- REGIONAL_LIMITS POLICIES

-- Public read access for urgency display
CREATE POLICY "public_read_regional_limits"
ON regional_limits FOR SELECT
USING (true);

-- Service role can update regional data
CREATE POLICY "service_role_update_regional_limits"
ON regional_limits FOR UPDATE
USING (is_service_role())
WITH CHECK (is_service_role());

-- =================================================================
-- PHASE 6: CREATE PERFORMANCE INDEXES
-- =================================================================

-- Email lookup (most common operation)
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email 
ON waitlist_users(email);

-- Verification token lookup (email verification)
CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_token 
ON waitlist_users(verification_token) 
WHERE verification_token IS NOT NULL;

-- Verification status (filtering verified users)
CREATE INDEX IF NOT EXISTS idx_waitlist_users_verification_status 
ON waitlist_users(is_verified, created_at);

-- Quiz completion status
CREATE INDEX IF NOT EXISTS idx_waitlist_users_quiz_completed 
ON waitlist_users(quiz_completed, waitlist_position);

-- Geographic queries
CREATE INDEX IF NOT EXISTS idx_waitlist_users_country 
ON waitlist_users(country);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_country_code 
ON waitlist_users(country_code);

-- Referral system indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_referral_code ON waitlist_users(referral_code);

-- Quiz responses by user
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id 
ON quiz_responses(user_id, created_at);

-- Regional limits by country code
CREATE INDEX IF NOT EXISTS idx_regional_limits_country_code 
ON regional_limits(country_code);

-- =================================================================
-- PHASE 7: INSERT INITIAL REGIONAL DATA
-- =================================================================

-- Insert initial regional limits
INSERT INTO regional_limits (country, country_code, total_spots, remaining_spots, current_registrations, urgency_level) 
VALUES 
    ('New Zealand', 'NZ', 50, 8, 42, 'high'),
    ('Australia', 'AU', 150, 22, 128, 'medium'),
    ('United States', 'US', 200, 33, 167, 'medium'),
    ('United Kingdom', 'GB', 100, 11, 89, 'high'),
    ('Canada', 'CA', 80, 17, 63, 'medium'),
    ('Singapore', 'SG', 30, 4, 26, 'high'),
    ('Other', 'XX', 50, 19, 31, 'medium')
ON CONFLICT (country_code) DO NOTHING;

-- =================================================================
-- PHASE 8: GRANT PERMISSIONS
-- =================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON waitlist_users TO authenticated;
GRANT ALL ON quiz_responses TO authenticated;
GRANT ALL ON referrals TO authenticated;
GRANT ALL ON regional_limits TO authenticated;
GRANT EXECUTE ON FUNCTION apply_referral_boost(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_quiz_response(UUID, JSONB) TO authenticated;

-- =================================================================
-- FINAL SUCCESS MESSAGE
-- =================================================================

DO $$
BEGIN
    RAISE NOTICE '🎯 BMad ORCHESTRATOR: DATABASE DEPLOYMENT COMPLETE!';
    RAISE NOTICE '✅ Tables: waitlist_users, quiz_responses, referrals, regional_limits';
    RAISE NOTICE '✅ RLS Policies: Configured for security';
    RAISE NOTICE '✅ Functions: Email verification, quiz submission, referrals';
    RAISE NOTICE '✅ Indexes: Performance optimized';
    RAISE NOTICE '🚀 Ready for Edge Functions deployment!';
END $$;