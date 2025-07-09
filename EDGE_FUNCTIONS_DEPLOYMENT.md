# Edge Functions Deployment Guide

## Problem
The verify-email Edge Function is returning a 401 "Missing authorization header" error because it hasn't been deployed to Supabase yet.

## Solution Steps

### 1. Install Supabase CLI (if not already installed)
```bash
# For Windows (using npm)
npm install -g supabase

# Or download from: https://github.com/supabase/cli/releases
```

### 2. Get Your Project Reference ID
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to Settings → General
4. Copy your "Reference ID" (it looks like: `fahqjxrakczftopskki` or similar)

### 3. Link Your Local Project to Supabase
```bash
cd C:\Users\denni\.purrfectstays
supabase link --project-ref YOUR_PROJECT_REF_HERE
```

When prompted, enter your Supabase access token:
1. Go to https://supabase.com/dashboard/account/tokens
2. Generate a new access token
3. Copy and paste it when prompted

### 4. Deploy All Edge Functions
```bash
# Deploy all functions at once
supabase functions deploy

# Or deploy individually
supabase functions deploy verify-email
supabase functions deploy send-verification-email
supabase functions deploy send-welcome-email
```

### 5. Set Environment Variables in Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to Settings → Edge Functions
3. Add these environment variables:
   - `SITE_URL`: https://purrfect-landingpage.netlify.app
   - `RESEND_API_KEY`: Your Resend API key
   - `ALLOWED_ORIGINS`: https://purrfect-landingpage.netlify.app,http://localhost:5173

### 6. Verify Deployment
1. Go to your Supabase Dashboard → Edge Functions
2. You should see all three functions listed as "Active"
3. Click on "verify-email" to see its details and logs

### 7. Test the Function
The verify-email function URL format is:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/verify-email?token=VERIFICATION_TOKEN
```

## What This Fixes
- The 401 error will be resolved once the functions are deployed
- Email verification links will work properly
- Users will be able to verify their emails and proceed with the quiz

## Important Notes
- The verify-email function is designed to be accessed via GET requests without authentication
- The 401 error was misleading - it actually meant the function wasn't found/deployed
- Make sure all environment variables are set correctly in the Supabase dashboard