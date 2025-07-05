-- Token Analysis Script
-- Run this to understand exactly what's happening with your verification tokens

-- 1. Show me all unverified users with tokens
SELECT 
    id,
    email,
    LEFT(verification_token, 10) || '...' as token_preview,
    LENGTH(verification_token) as token_length,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 as hours_old
FROM waitlist_users
WHERE is_verified = false 
AND verification_token IS NOT NULL
ORDER BY created_at DESC;

-- 2. Check for any weird characters or encoding issues
SELECT 
    id,
    email,
    encode(verification_token::bytea, 'hex') as token_hex,
    octet_length(verification_token) as byte_length,
    char_length(verification_token) as char_length
FROM waitlist_users
WHERE is_verified = false 
AND verification_token IS NOT NULL
LIMIT 5;

-- 3. Test if a simple update works (without RLS)
-- First, note an ID and token from above, then:
DO $$
DECLARE
    test_user RECORD;
BEGIN
    -- Get a test user
    SELECT * INTO test_user
    FROM waitlist_users
    WHERE is_verified = false 
    AND verification_token IS NOT NULL
    LIMIT 1;
    
    IF test_user IS NULL THEN
        RAISE NOTICE 'No unverified users found';
    ELSE
        RAISE NOTICE 'Found user: % with token starting with: %', 
            test_user.email, 
            LEFT(test_user.verification_token, 10);
            
        -- Try to update
        UPDATE waitlist_users
        SET is_verified = true
        WHERE id = test_user.id;
        
        RAISE NOTICE 'Update attempted. Check if it worked.';
    END IF;
END $$;

-- 4. Check what RLS policies would do
SELECT 
    current_setting('row_security', true) as row_security_setting,
    current_setting('is_superuser', true) as is_superuser,
    current_user as current_user_name;

-- 5. Simulate what your app is trying to do
-- Replace 'YOUR_TOKEN_HERE' with an actual token from your logs
/*
BEGIN;
    -- Show current state
    SELECT id, email, is_verified, verification_token IS NOT NULL as has_token
    FROM waitlist_users
    WHERE verification_token = 'YOUR_TOKEN_HERE';
    
    -- Try the update
    UPDATE waitlist_users
    SET is_verified = true, verification_token = null
    WHERE verification_token = 'YOUR_TOKEN_HERE';
    
    -- Check if it worked
    SELECT id, email, is_verified, verification_token
    FROM waitlist_users
    WHERE id = (SELECT id FROM waitlist_users WHERE verification_token = 'YOUR_TOKEN_HERE');
ROLLBACK; -- Remove this to commit the change
*/