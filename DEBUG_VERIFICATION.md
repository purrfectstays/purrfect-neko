# Email Verification Debug Guide

## Current Issue
- **Error**: 406 Not Acceptable
- **Location**: waitlistService.verifyEmail()
- **Root Cause**: RLS policies blocking the update operation

## Debug Steps

### 1. First, Check Current RLS Policies
Run this in Supabase SQL Editor to see what policies exist:

```sql
-- Check all policies on waitlist_users table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'waitlist_users'
ORDER BY policyname;
```

### 2. Test Direct Update (Bypass RLS)
Run this to test if the update works without RLS:

```sql
-- First, find a user with a verification token
SELECT id, email, verification_token, is_verified 
FROM waitlist_users 
WHERE verification_token IS NOT NULL 
LIMIT 1;

-- Then try updating directly (replace values from above query)
UPDATE waitlist_users 
SET is_verified = true, verification_token = null 
WHERE id = 'YOUR_USER_ID' 
AND verification_token = 'YOUR_TOKEN';
```

### 3. Check for Conflicting Policies
Remove ALL existing policies and recreate clean ones:

```sql
-- Remove ALL policies on waitlist_users
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'waitlist_users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist_users', pol.policyname);
    END LOOP;
END $$;

-- Create minimal policies for verification
CREATE POLICY "anyone_can_read_with_token"
ON waitlist_users FOR SELECT
USING (true);

CREATE POLICY "anyone_can_verify_with_token"
ON waitlist_users FOR UPDATE
USING (verification_token IS NOT NULL)
WITH CHECK (
    is_verified = true 
    AND verification_token IS NULL
);

CREATE POLICY "allow_new_registrations"
ON waitlist_users FOR INSERT
WITH CHECK (
    is_verified = false 
    AND verification_token IS NOT NULL
);
```

### 4. Add Debug Logging
Update your waitlistService.ts to log the exact query being attempted:

```typescript
console.log('🔍 Attempting verification with:', {
  token: token.substring(0, 8) + '...',
  tokenLength: token.length,
  userId: user.id,
  currentVerificationStatus: user.is_verified,
  hasToken: !!user.verification_token
});
```

### 5. Check Token Format
Verify the token format matches:

```sql
-- Check token format in database
SELECT 
    id,
    email,
    LENGTH(verification_token) as token_length,
    LEFT(verification_token, 10) as token_preview,
    is_verified
FROM waitlist_users 
WHERE verification_token IS NOT NULL;
```

### 6. Nuclear Option - Temporary Fix
If nothing else works, temporarily bypass RLS for testing:

```sql
-- ONLY FOR DEBUGGING - NOT FOR PRODUCTION
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;

-- Test verification again

-- Then re-enable
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
```

## Most Likely Issues

1. **Conflicting Policies**: Old policies from previous migrations may be interfering
2. **Token Mismatch**: The token in the query might not exactly match the database
3. **Policy Logic Error**: The WITH CHECK clause might be too restrictive

## Quick Fix Sequence

1. Run the policy cleanup (Step 3 above)
2. Test verification again
3. If it works, the issue was conflicting policies
4. If it doesn't work, check the debug logs for token mismatch

## Alternative Approach
If RLS continues to be problematic, consider:
1. Using a Supabase Edge Function for verification (bypasses RLS)
2. Using the service role key in a secure backend
3. Temporarily using a stored procedure with SECURITY DEFINER