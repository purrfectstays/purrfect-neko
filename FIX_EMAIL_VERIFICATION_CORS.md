# Fix for Email Verification and CORS Issues

## Problem Summary
1. **CORS errors** when calling Supabase Edge Functions from the frontend
2. **Email verification failing** even though emails are being sent

## Root Causes
1. Edge Functions are not configured with proper CORS headers for your domain
2. The verification URL in the email might be using the wrong domain

## Solution Steps

### Step 1: Configure CORS in Supabase Dashboard

1. **Log into your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to Edge Functions Settings**
   - Click on "Edge Functions" in the left sidebar
   - You should see your functions: `send-verification-email` and `verify-email`

3. **Configure CORS for Each Function**
   - Click on `send-verification-email`
   - Look for "CORS Settings" or "Environment Variables"
   - Add these environment variables:
     ```
     ALLOWED_ORIGINS=https://purrfect-landingpage.netlify.app,http://localhost:5173
     SITE_URL=https://purrfect-landingpage.netlify.app
     ```

4. **Repeat for `verify-email` function**
   - Same environment variables as above

5. **Deploy the Functions Again**
   - After adding environment variables, redeploy both functions
   - Click "Deploy" or "Redeploy" button for each function

### Step 2: Update Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Navigate to your site settings
   - Go to "Environment variables"

2. **Ensure these are set correctly:**
   ```
   VITE_APP_URL=https://purrfect-landingpage.netlify.app
   VITE_SUPABASE_URL=https://ollsdbhjhquivjkjnei.supabase.co
   VITE_SUPABASE_ANON_KEY=[your anon key]
   ```

### Step 3: Test the Fix

1. **Run the diagnostic script locally:**
   ```bash
   npm install dotenv
   node scripts/test-edge-function-cors.js
   ```

2. **Test registration flow:**
   - Go to your site
   - Register with a valid email
   - Check if email is received
   - Click verification link
   - Should redirect to quiz page

### Step 4: Alternative Quick Fix (if CORS persists)

If CORS issues persist, we can modify the Edge Functions to be more permissive:

1. **Update Edge Function Code**
   
   In `supabase/functions/send-verification-email/index.ts`, update the CORS headers function:

   ```typescript
   function getCorsHeaders(origin: string | null): Record<string, string> {
     // For development/testing, allow all origins
     const allowedOrigin = origin || '*';
     
     return {
       'Access-Control-Allow-Origin': allowedOrigin,
       'Access-Control-Allow-Headers': '*',
       'Access-Control-Allow-Methods': 'POST, OPTIONS',
       'Access-Control-Max-Age': '86400',
       'Access-Control-Allow-Credentials': 'true',
       'Vary': 'Origin',
     };
   }
   ```

2. **Deploy the updated function:**
   ```bash
   supabase functions deploy send-verification-email
   ```

### Step 5: Verify Email Link Format

The verification email should contain a link like:
```
https://ollsdbhjhquivjkjnei.supabase.co/functions/v1/verify-email?token=YOUR_TOKEN&redirect_url=https://purrfect-landingpage.netlify.app
```

This link will:
1. Hit the Edge Function directly (bypassing CORS)
2. Verify the email server-side
3. Redirect to your app with success/error parameters

## Testing Checklist

- [ ] CORS preflight requests return proper headers
- [ ] Registration creates user in database
- [ ] Verification email is sent
- [ ] Email contains correct verification link
- [ ] Clicking link verifies user
- [ ] User is redirected to quiz after verification
- [ ] Quiz loads with verified user data

## Common Issues and Solutions

### Issue: "Failed to fetch" error
**Solution:** This is a CORS error. Follow Step 1 to configure CORS in Supabase.

### Issue: "Invalid verification token"
**Solution:** 
1. Check that the token in the URL matches the one in the database
2. Ensure the token hasn't been used already
3. Verify the user isn't already verified

### Issue: Email sent but link doesn't work
**Solution:**
1. Check the Edge Function logs in Supabase Dashboard
2. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Edge Function environment
3. Verify the redirect URL is correct

## Support

If issues persist:
1. Check Supabase Edge Function logs for errors
2. Run the diagnostic script and share the output
3. Check browser console for specific error messages