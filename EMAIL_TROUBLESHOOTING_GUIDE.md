# 🚨 Email Issues Troubleshooting Guide

## Current Problem
Verification and confirmation emails are not being sent or received.

## 🔍 Diagnostic Steps

### Step 1: Check Environment Variables
Verify these are set correctly in your deployment:

```
RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
SITE_URL=https://purrfectstays.org
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go
```

### Step 2: Test Email Service Directly

#### Quick Test via Resend Dashboard:
1. Go to https://resend.com/emails
2. Login with your account
3. Try sending a test email
4. Check if it works from the dashboard

### Step 3: Check Supabase Edge Functions

#### Verify Edge Functions are Deployed:
1. Go to your Supabase dashboard
2. Navigate to Edge Functions
3. Check if these functions exist:
   - `send-verification-email`
   - `send-welcome-email`

## 🛠️ Common Fixes

### Fix 1: Redeploy Edge Functions
```bash
# If you have Supabase CLI installed
supabase functions deploy send-verification-email
supabase functions deploy send-welcome-email
```

### Fix 2: Update Environment Variables in Supabase
1. Go to Supabase Dashboard → Settings → Environment Variables
2. Add these variables:
   ```
   RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
   SITE_URL=https://purrfectstays.org
   ```

### Fix 3: Check Email Domain Configuration
The edge functions are currently set to send from:
- `hello@purrfectstays.org`

But this domain needs to be verified in Resend first.

## 🚀 Immediate Solutions

### Solution A: Use Default Resend Domain (Quick Fix)
Update the edge functions to use the default Resend domain temporarily.

### Solution B: Set Up Custom Domain in Resend
1. Add purrfectstays.org to your Resend account
2. Verify DNS records
3. Update edge functions to use custom domain

### Solution C: Test with Alternative Email Service
Temporarily switch to a different email service for testing.

## 📧 Manual Testing Steps

1. **Register a new user** on your website
2. **Check browser console** for any errors
3. **Check Supabase logs** for edge function errors
4. **Check Resend dashboard** for email delivery logs
5. **Check spam folders** in email clients

## 🔧 Debug Information Needed

To help diagnose further, please check:

1. **Browser Console Errors:** Any JavaScript errors when registering?
2. **Supabase Edge Function Logs:** Any errors in the function execution?
3. **Resend Dashboard:** Any failed email attempts logged?
4. **Network Tab:** Are the API calls to edge functions succeeding?

## 📞 Next Steps

1. Try the quick fixes above
2. If still not working, we'll need to check the specific error messages
3. May need to temporarily use a different email configuration