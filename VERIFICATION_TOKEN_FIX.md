# Email Verification Token Fix

## Problem Identified

The "Invalid or expired verification token" error occurs due to several issues in the verification flow:

1. **Token Lookup Issue**: The Edge Function queries for users with `is_verified = false`, but if a user clicks the link twice, they won't be found.

2. **Missing Debugging**: The current Edge Function doesn't provide enough logging to diagnose token mismatches.

3. **Strict Query Conditions**: The query combines multiple conditions that might fail if any one doesn't match.

## Root Cause

In the `verify-email/index.ts` Edge Function (lines 112-117):
```typescript
const { data: userData, error: findError } = await supabase
  .from('waitlist_users')
  .select('id, email, name, user_type, is_verified')
  .eq('verification_token', cleanToken)
  .eq('is_verified', false)  // <-- This causes issues for already verified users
  .single();
```

## Solution

### 1. Update the Edge Function

Replace the current `verify-email/index.ts` with the fixed version that:
- First checks for ANY user with the token (regardless of verification status)
- Handles already-verified users gracefully
- Provides better error logging
- Uses more robust error handling

### 2. Key Changes in the Fix

1. **Two-Stage Lookup**:
   ```typescript
   // First, find ANY user with this token
   const { data: anyUser, error: anyUserError } = await supabase
     .from('waitlist_users')
     .select('id, email, name, user_type, is_verified, verification_token')
     .eq('verification_token', cleanToken)
     .single();
   ```

2. **Better Already-Verified Handling**:
   ```typescript
   if (anyUser.is_verified) {
     console.log('ℹ️ User already verified:', anyUser.email);
     return Response.redirect(
       `${frontendUrl}/verify-result?success=true&message=${encodeURIComponent('Email already verified')}&...`,
       302
     );
   }
   ```

3. **Enhanced Debugging**:
   - Logs token preview for debugging
   - Shows sample users when token not found
   - Better error messages

### 3. Deployment Steps

1. **Backup current Edge Function**:
   ```bash
   cp supabase/functions/verify-email/index.ts supabase/functions/verify-email/index-backup.ts
   ```

2. **Replace with fixed version**:
   ```bash
   cp supabase/functions/verify-email/index-fixed.ts supabase/functions/verify-email/index.ts
   ```

3. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy verify-email
   ```

### 4. Testing the Fix

Use the debug script to verify tokens:
```bash
node scripts/debug-verification-token.js user@example.com
```

This will show:
- Current token for the user
- Whether it's a valid UUID
- The exact verification URL
- Whether the token lookup would succeed

### 5. Additional Recommendations

1. **Add Token Expiration**: Consider adding a token expiration check (e.g., 24 hours)
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Better Error Pages**: Create user-friendly error pages with support contact

## Emergency Workaround

If users are stuck, you can manually verify them:
```sql
UPDATE waitlist_users 
SET is_verified = true, verification_token = null 
WHERE email = 'user@example.com';
```

## Monitoring

After deployment, monitor:
1. Edge Function logs for any errors
2. Success rate of verifications
3. User feedback on verification issues