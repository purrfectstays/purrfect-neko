-- Purrfect Stays - Database Validation Script
-- BMad Orchestrator - Nuclear Option Database Verification

-- Run this in Supabase Dashboard → SQL Editor after migration

-- ==============================================
-- STEP 1: VERIFY ALL TABLES EXIST
-- ==============================================

SELECT 'Checking table existence...' as status;

SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('waitlist_users', 'quiz_responses', 'referrals') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('waitlist_users', 'quiz_responses', 'referrals');

-- ==============================================
-- STEP 2: VERIFY WAITLIST_USERS TABLE STRUCTURE
-- ==============================================

SELECT 'Checking waitlist_users columns...' as status;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist_users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ==============================================
-- STEP 3: VERIFY RLS POLICIES
-- ==============================================

SELECT 'Checking Row Level Security policies...' as status;

SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('waitlist_users', 'quiz_responses', 'referrals')
ORDER BY tablename, policyname;

-- ==============================================
-- STEP 4: VERIFY FUNCTIONS EXIST
-- ==============================================

SELECT 'Checking custom functions...' as status;

SELECT 
  routine_name,
  routine_type,
  '✅ EXISTS' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'apply_referral_boost',
    'get_referral_stats',
    'verify_user_email',
    'submit_quiz_response'
  );

-- ==============================================
-- STEP 5: TEST DATABASE OPERATIONS
-- ==============================================

SELECT 'Testing basic operations...' as status;

-- Test insert operation (will rollback)
BEGIN;
  INSERT INTO waitlist_users (
    email, 
    name, 
    user_type, 
    is_verified,
    verification_token,
    waitlist_position
  ) VALUES (
    'test@bmadorchestrator.com',
    'BMad Test User',
    'cat_parent',
    false,
    'test123',
    1
  );
  
  SELECT 'Test insert: ✅ SUCCESS' as result;
ROLLBACK;

-- ==============================================
-- STEP 6: VERIFICATION SUMMARY
-- ==============================================

SELECT 'DATABASE VERIFICATION COMPLETE!' as status;

-- Count existing data
SELECT 
  'Total waitlist users: ' || COUNT(*) as summary
FROM waitlist_users
UNION ALL
SELECT 
  'Total quiz responses: ' || COUNT(*) as summary
FROM quiz_responses
UNION ALL
SELECT 
  'Total referrals: ' || COUNT(*) as summary
FROM referrals;

-- Final status
SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('waitlist_users', 'quiz_responses', 'referrals')
    ) = 3 
    THEN '🎯 BMad Orchestrator: Database setup SUCCESSFUL! ✅'
    ELSE '❌ BMad Orchestrator: Database setup FAILED - Missing tables'
  END as final_status;