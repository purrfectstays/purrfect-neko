# Emergency Email Verification Fix 🚨

## Current Issue
Users are receiving verification emails but the verification process is failing due to RLS (Row Level Security) restrictions, even when using the service role key.

## Root Cause
The Edge Function isn't properly bypassing RLS policies when updating user verification status, causing "Failed to update verification status" errors.

## 🚀 Immediate Fix Required

### Step 1: Deploy Enhanced Edge Function
The Edge Function has been enhanced with:
- Better service role client configuration
- Detailed error logging
- Fallback update strategies
- Alternative update approaches for RLS issues

**Deploy via Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Navigate to Edge Functions → `verify-email`
3. Replace the entire code with the updated `supabase/functions/verify-email/index.ts`
4. Click "Deploy"

### Step 2: Apply Database Migration (Optional but Recommended)
The new migration creates a function that can bypass RLS:

```sql
-- Run this in your Supabase SQL Editor
-- Or apply the migration file: supabase/migrations/20250107_create_verify_user_function.sql

CREATE OR REPLACE FUNCTION verify_user_email(user_id UUID, token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_exists BOOLEAN := FALSE;
BEGIN
    -- Check if user exists with the given token and is not verified
    SELECT EXISTS(
        SELECT 1 FROM waitlist_users 
        WHERE id = user_id 
        AND verification_token = token 
        AND is_verified = FALSE
    ) INTO user_exists;
    
    -- If user exists and is not verified, update them
    IF user_exists THEN
        UPDATE waitlist_users 
        SET 
            is_verified = TRUE,
            verification_token = NULL,
            updated_at = NOW()
        WHERE id = user_id AND verification_token = token;
        
        RETURN TRUE;
    END IF;
    
    -- Check if user is already verified with this token
    SELECT EXISTS(
        SELECT 1 FROM waitlist_users 
        WHERE id = user_id 
        AND (verification_token = token OR verification_token IS NULL)
        AND is_verified = TRUE
    ) INTO user_exists;
    
    -- Return true if already verified (no error)
    RETURN user_exists;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_user_email(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_email(UUID, TEXT) TO service_role;
```

### Step 3: Verify Environment Variables
Ensure these are set in your Edge Function environment:

```
SUPABASE_SERVICE_ROLE_KEY=[your actual service role key]
SUPABASE_URL=https://ollsdbhjhquivjkjnei.supabase.co
SITE_URL=https://purrfect-landingpage.netlify.app
ALLOWED_ORIGINS=https://purrfect-landingpage.netlify.app,http://localhost:5173
```

## 🔍 What the Fix Does

1. **Enhanced Service Role Client**: Explicitly sets Authorization header and schema
2. **Better Error Logging**: Shows exactly why updates are failing
3. **Fallback Strategy**: If main update fails, tries alternative approach
4. **Database Function**: Bypasses RLS with SECURITY DEFINER function
5. **Retry Logic**: Handles temporary database issues

## 📊 Expected Results After Fix

✅ **Before Fix:**
- Users get "Invalid or expired verification token" errors
- Database updates fail due to RLS restrictions
- Verification emails work but links don't

✅ **After Fix:**
- Verification links work properly
- Users are successfully verified
- Clear error messages if issues occur
- Better debugging information in logs

## 🧪 Testing the Fix

1. **Register a new user** on your site
2. **Check email** for verification link
3. **Click verification link** - should redirect to quiz
4. **Check Supabase logs** for detailed verification process
5. **Verify user in database** - `is_verified` should be `true`

## 🚨 If Issues Persist

Check Supabase Edge Function logs for:
- Service role key configuration
- RLS policy violations
- Database connection issues
- Token matching problems

The enhanced logging will show exactly where the verification is failing.

## 📝 Backup Plan

If the Edge Function approach doesn't work, we can:
1. Temporarily disable RLS on `waitlist_users` table
2. Use a webhook approach instead of Edge Functions
3. Handle verification purely on the frontend with proper service calls

**This fix addresses the core RLS bypass issue and should resolve the verification failures immediately.**