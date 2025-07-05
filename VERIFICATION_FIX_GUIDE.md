# Email Verification Fix Guide

## Issue Summary
The email verification is failing with a 406 "Not Acceptable" error because the Row Level Security (RLS) policies are blocking the update operation. The policies expect authentication context that isn't available during the public email verification process.

## Changes Made

### 1. Updated `waitlistService.ts`
Modified the verification logic to:
- First attempt to update using the verification token directly
- Fall back to updating by ID + token if the first attempt fails
- This ensures compatibility with various RLS policy configurations

### 2. Created Migration File
Created `supabase/migrations/20250707_fix_verification_rls.sql` that:
- Adds a new RLS policy allowing verification updates using token
- Improves read policies for the verification flow
- Adds an index for better performance on token lookups

## Solution Options

### Option 1: Apply the RLS Migration (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250107_fix_verification_update_rls.sql`
4. Run the migration
5. Test the verification flow - it should now work

### Option 2: Use Service Role Key (Alternative)
If you can't modify RLS policies:
1. Get your service role key from Supabase Dashboard > Settings > API
2. Add to your environment variables:
   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. The code will automatically use the admin client for verification

### Option 3: Temporary RLS Disable (Quick Fix)
**⚠️ Only for testing, not for production:**
```sql
-- Temporarily disable RLS on waitlist_users
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
```

After testing, re-enable:
```sql
-- Re-enable RLS
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
```

### Step 2: Deploy Code Changes
Push the updated `waitlistService.ts` to your repository:
```bash
git add src/services/waitlistService.ts
git add supabase/migrations/20250707_fix_verification_rls.sql
git commit -m "Fix email verification RLS policies"
git push origin main
```

### Step 3: Verify the Fix
1. Register a new test user
2. Check that the verification email is sent
3. Click the verification link
4. Confirm that verification succeeds without errors

## Alternative Quick Fix (If Migration Can't Be Applied)

If you can't apply the migration immediately, you can temporarily disable RLS on the waitlist_users table:

```sql
-- TEMPORARY: Disable RLS (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
```

**Important:** This is only a temporary workaround. Re-enable RLS and apply the proper migration as soon as possible:

```sql
-- Re-enable RLS after applying the migration
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
```

## Root Cause
The issue occurred because the RLS policies expected JWT claims or specific headers that weren't being provided during the verification process. The new policies allow verification updates when the verification token matches, making the process more flexible while maintaining security.