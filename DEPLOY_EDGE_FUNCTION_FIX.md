# Deploy Edge Function Fix

## ✅ What Was Fixed

I've fixed the Edge Function `verify-email/index.ts` to resolve the "Invalid or expired verification token" error. The main issue was that it was looking for users with **both** `verification_token` matching AND `is_verified = false`, which failed when users clicked the link twice.

## 🚀 How to Deploy the Fix

Since Docker Desktop is required for local deployment, here are your options:

### Option 1: Deploy via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Open https://app.supabase.com
   - Select your project

2. **Navigate to Edge Functions**
   - Click "Edge Functions" in the left sidebar
   - Find the `verify-email` function

3. **Update the Function Code**
   - Click on the `verify-email` function
   - Replace the entire code with the content from `supabase/functions/verify-email/index.ts`
   - Click "Deploy" or "Save & Deploy"

### Option 2: Deploy via CLI (if you have Docker Desktop)

If you have Docker Desktop installed:

```bash
# Make sure Docker Desktop is running
# Then deploy the function
npx supabase functions deploy verify-email
```

## 🔧 Environment Variables to Set

Make sure these environment variables are set in your Supabase Edge Function:

```
ALLOWED_ORIGINS=https://purrfect-landingpage.netlify.app,http://localhost:5173
SITE_URL=https://purrfect-landingpage.netlify.app
SUPABASE_URL=https://ollsdbhjhquivjkjnei.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your service role key]
```

## 🧪 Test the Fix

After deployment, test with these steps:

1. **Register a new user** on your site
2. **Check email** for verification link
3. **Click the verification link** - should redirect to quiz
4. **Click the link again** - should show "already verified" instead of error

## 🔍 Debug Tools

I've created debug scripts to help troubleshoot:

```bash
# Check specific user's token
node scripts/debug-verification-token.js user@example.com

# Test CORS configuration
node scripts/test-edge-function-cors.js
```

## ✨ What the Fix Does

1. **Handles already-verified users gracefully** - shows success instead of error
2. **Better token lookup logic** - removes unnecessary filter that caused failures
3. **Enhanced logging** - helps debug issues in Supabase function logs
4. **Clears tokens after use** - prevents token reuse
5. **Better error messages** - more helpful feedback for users

## 📝 Verification

After deployment, you should see:
- ✅ Email verification links work on first click
- ✅ Already verified users see success message instead of error
- ✅ Better error messages in Supabase function logs
- ✅ No more "Invalid or expired verification token" for valid tokens

The fix is now committed to your repository and ready for deployment!