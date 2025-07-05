# Immediate Fix Steps for Email Verification 406 Error

## Quick Solutions (Try in Order)

### 1. 🚀 Fastest Fix - Disable RLS Temporarily (2 minutes)
```sql
-- In Supabase SQL Editor, run:
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
```
- Test verification immediately
- If it works, the issue is confirmed to be RLS policies
- **Remember to re-enable RLS after fixing policies!**

### 2. 🔧 Apply Stored Procedure Fix (5 minutes)
Copy and run this in Supabase SQL Editor:
```sql
CREATE OR REPLACE FUNCTION verify_email_with_token(token_param text)
RETURNS json AS $$
DECLARE
    updated_user RECORD;
BEGIN
    UPDATE waitlist_users
    SET is_verified = true, verification_token = null
    WHERE verification_token = token_param
    RETURNING * INTO updated_user;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid token');
    END IF;
    
    RETURN json_build_object('success', true, 'user', row_to_json(updated_user));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION verify_email_with_token(text) TO anon, authenticated;
```
- The code will automatically use this function as a fallback
- No frontend changes needed

### 3. 🛡️ Fix RLS Policies (10 minutes)
Run the complete policy fix from `20250107_simple_verification_fix.sql`:
1. Go to Supabase SQL Editor
2. Copy the entire file content
3. Run it
4. Re-enable RLS if you disabled it:
```sql
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
```

## Debugging Commands

### Check Current State:
```sql
-- 1. Is RLS enabled?
SELECT relrowsecurity FROM pg_class WHERE relname = 'waitlist_users';

-- 2. What policies exist?
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'waitlist_users';

-- 3. Test direct update (with an actual token from your logs):
UPDATE waitlist_users 
SET is_verified = true 
WHERE verification_token = 'YOUR_TOKEN_HERE'
RETURNING email, is_verified;
```

## Why This Is Happening

The 406 error occurs because:
1. RLS is enabled on `waitlist_users` table
2. Current policies don't allow public updates with just a token
3. The Supabase client isn't authenticated during verification

## Permanent Solution

After testing, implement the complete fix:
1. Use the stored procedure approach (most reliable)
2. OR fix RLS policies properly
3. Deploy the updated code

## Emergency Contacts

If still stuck:
1. Check Supabase Dashboard > Logs for detailed errors
2. Verify CORS settings include your domain
3. Ensure environment variables are correct

The stored procedure approach (Option 2) is the most reliable because it bypasses RLS complexity while maintaining security.