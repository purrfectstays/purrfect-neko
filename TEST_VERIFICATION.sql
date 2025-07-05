-- Direct test to diagnose verification issues
-- Run each section in order in Supabase SQL Editor

-- 1. Check if RLS is enabled
SELECT 
    relname as table_name,
    CASE relrowsecurity 
        WHEN true THEN 'RLS ENABLED ⚠️' 
        ELSE 'RLS DISABLED ✓' 
    END as rls_status
FROM pg_class 
WHERE relname = 'waitlist_users';

-- 2. List all current policies
SELECT 
    policyname as "Policy Name",
    cmd as "Operation",
    permissive as "Type",
    roles as "Roles"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'waitlist_users'
ORDER BY policyname;

-- 3. Find a test user with verification token
SELECT 
    id,
    email,
    is_verified,
    CASE 
        WHEN verification_token IS NULL THEN 'NO TOKEN'
        ELSE 'HAS TOKEN (' || LENGTH(verification_token)::text || ' chars)'
    END as token_status,
    created_at
FROM waitlist_users 
WHERE is_verified = false
ORDER BY created_at DESC
LIMIT 5;

-- 4. Test update without RLS (as superuser)
-- Copy a user ID and token from above, then run:
/*
UPDATE waitlist_users 
SET is_verified = true, verification_token = null 
WHERE id = 'PASTE_USER_ID_HERE'
RETURNING id, email, is_verified;
*/

-- 5. If step 4 works, the issue is RLS policies
-- Apply this emergency fix:
/*
-- TEMPORARY FIX - Remove after testing
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
*/

-- 6. After testing, re-enable RLS:
/*
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
*/