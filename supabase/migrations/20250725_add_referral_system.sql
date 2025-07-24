-- Add referral system to the database

-- Add referral fields to waitlist_users table
ALTER TABLE waitlist_users 
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referred_by UUID REFERENCES waitlist_users(id),
ADD COLUMN referral_count INTEGER DEFAULT 0;

-- Create referrals tracking table
CREATE TABLE referrals (
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

-- Create indexes for performance
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_waitlist_users_referral_code ON waitlist_users(referral_code);

-- Create function to apply referral position boost
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

-- Enable RLS on referrals table
ALTER TABLE referrals ENABLE row_level_security;

-- RLS policies for referrals table
CREATE POLICY "Users can view their own referrals" ON referrals
  FOR SELECT USING (
    referrer_id = auth.uid() OR 
    referred_id = auth.uid()
  );

CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (
    referrer_id = auth.uid()
  );

CREATE POLICY "System can update referrals" ON referrals
  FOR UPDATE USING (true);

-- Update waitlist_users RLS to include referral fields
DROP POLICY IF EXISTS "Users can view their own data" ON waitlist_users;
CREATE POLICY "Users can view their own data" ON waitlist_users
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own data" ON waitlist_users;
CREATE POLICY "Users can update their own data" ON waitlist_users
  FOR UPDATE USING (id = auth.uid());

-- Function to get referral stats (for API use)
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON referrals TO authenticated;
GRANT EXECUTE ON FUNCTION apply_referral_boost(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_stats(UUID) TO authenticated;