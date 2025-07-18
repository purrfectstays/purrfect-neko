# 🚀 Purrfect Stays Production Deployment Checklist

This checklist provides step-by-step instructions for deploying Purrfect Stays to production. Each step includes exact button names, expected screens, and troubleshooting tips.

## 📋 Table of Contents
1. [Pre-deployment Verification](#1-pre-deployment-verification)
2. [Deployment Steps](#2-deployment-steps)
3. [Post-deployment Validation](#3-post-deployment-validation)
4. [Rollback Procedures](#4-rollback-procedures)
5. [Quick Reference](#5-quick-reference)

---

## 1. Pre-deployment Verification

### 1.1 Environment Variable Setup Validation

**What you're doing**: Making sure all required settings are properly configured before deployment.

#### Step-by-Step Instructions:

1. **Open your project folder**
   - Navigate to: `C:\Users\denni\.purrfectstays`
   - Look for a file named `.env.example`

2. **Create your environment file**
   - Right-click in the folder
   - Select "New" → "Text Document"
   - Name it exactly: `.env` (remove the .txt extension)
   - If Windows warns about changing file extension, click "Yes"

3. **Copy required variables**
   - Open `.env.example` in Notepad
   - Copy all contents
   - Paste into your new `.env` file

4. **Fill in your values**
   Replace the placeholder values with your actual keys:
   ```
   # Frontend Variables (safe to expose)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_URL=https://purrfectstays.org
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   
   # Backend Variables (NEVER add VITE_ prefix)
   SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

   ⚠️ **CRITICAL**: 
   - Variables starting with `VITE_` will be visible to users
   - NEVER put sensitive keys (like service role or API keys) with VITE_ prefix

5. **Where to find your keys**:
   - **Supabase keys**: 
     - Go to [supabase.com](https://supabase.com)
     - Click your project
     - Click "Settings" (gear icon) → "API"
     - Copy "URL" and "anon public" key
   - **Resend API key**:
     - Go to [resend.com](https://resend.com)
     - Click "API Keys" in sidebar
     - Copy your API key
   - **Google Analytics**:
     - Go to [analytics.google.com](https://analytics.google.com)
     - Admin → Data Streams → Your stream
     - Copy Measurement ID

### 1.2 Build Process Verification

**What you're doing**: Testing that the app builds correctly before deployment.

1. **Open Command Prompt**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - Type: `cd C:\Users\denni\.purrfectstays`
   - Press Enter

2. **Install dependencies** (if not done already)
   ```
   npm install
   ```
   - Wait for "added X packages" message
   - This may take 2-3 minutes

3. **Test the build**
   ```
   npm run build
   ```
   - **Expected result**: "✓ built in X.XXs" message
   - **What you'll see**: Progress bars and file names
   - **Final message**: Should say "build complete"

4. **Check for errors**
   - ❌ **If you see red text**: There's an error
   - ✅ **If you see green checkmarks**: Build successful
   - 📁 A new `dist` folder should appear in your project

**Troubleshooting**:
- "npm not found": Install Node.js from [nodejs.org](https://nodejs.org)
- Red errors: Copy the error message and ask for help
- "Module not found": Run `npm install` again

### 1.3 Security Header Testing

**What you're doing**: Verifying security settings are correct.

1. **Check netlify.toml file**
   - Open `C:\Users\denni\.purrfectstays\netlify.toml`
   - Verify it contains security headers section
   - Look for `[[headers]]` section

2. **Verify CSP whitelist includes**:
   - `*.supabase.co` (for database)
   - `api.exchangerate-api.com` (for currency)
   - `www.googletagmanager.com` (for analytics)
   - `ipapi.co` (for geolocation)

### 1.4 API Endpoint Testing

**What you're doing**: Making sure all external services will work.

1. **Test locally first**
   ```
   npm run dev
   ```
   - Opens browser at `http://localhost:5173`
   - Test each feature:
     - ✅ Fill registration form
     - ✅ Enter 6-digit code
     - ✅ Complete quiz
     - ✅ See success page

2. **Check browser console**
   - Right-click on page → "Inspect"
   - Click "Console" tab
   - Look for:
     - ❌ Red errors = Problem
     - ⚠️ Yellow warnings = Usually OK
     - ✅ No errors = Good to go

---

## 2. Deployment Steps

### 2.1 Netlify Deployment Process

**What you're doing**: Publishing your website to the internet.

#### First-Time Setup:

1. **Create Netlify Account**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Sign up"
   - Choose "Sign up with GitHub" (recommended)
   - Authorize Netlify

2. **Import Your Project**
   - Click "Add new site" button (top right)
   - Select "Import an existing project"
   - Choose "Deploy with GitHub"
   - Click "Authorize Netlify"
   
3. **Select Repository**
   - Find "purrfectstays" in the list
   - Click on it
   - If not visible, click "Configure Netlify on GitHub"

4. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: Leave empty
   - Click "Show advanced" button

5. **Add Environment Variables**
   - Click "New variable" for each:
   
   | Key | Value | 
   |-----|-------|
   | VITE_SUPABASE_URL | Your Supabase URL |
   | VITE_SUPABASE_ANON_KEY | Your anon key |
   | VITE_APP_URL | https://purrfectstays.org |
   | VITE_GA_MEASUREMENT_ID | Your GA ID |
   | NODE_ENV | production |
   | SUPABASE_SERVICE_ROLE_KEY | Your service key |
   | RESEND_API_KEY | Your Resend key |

   - Click "Deploy site" button

6. **Wait for Deployment**
   - You'll see "Site deploy in progress"
   - Takes 2-5 minutes
   - ✅ Green "Published" = Success
   - ❌ Red "Failed" = Check deploy log

### 2.2 Supabase Configuration Updates

**What you're doing**: Telling Supabase to accept connections from your new website.

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Click your project

2. **Update Authentication Settings**
   - Click "Authentication" (left sidebar)
   - Click "URL Configuration"
   - Add to "Redirect URLs":
     - `https://purrfectstays.org/*`
     - `https://your-site.netlify.app/*`
   - Click "Save"

3. **Update CORS Settings**
   - Click "Edge Functions" (left sidebar)
   - For each function:
     - Click function name
     - Click "Settings" tab
     - Add to "CORS origins":
       - `https://purrfectstays.org`
       - `https://your-site.netlify.app`
     - Click "Save"

4. **Set Production Variables**
   - Still in Edge Functions
   - Click "Secrets" tab
   - Add:
     - `SITE_URL`: https://purrfectstays.org
     - `RESEND_API_KEY`: Your Resend key
   - Click "Save"

### 2.3 DNS and Domain Setup

**What you're doing**: Connecting your custom domain name.

1. **In Netlify Dashboard**
   - Go to your site dashboard
   - Click "Domain settings"
   - Click "Add custom domain"
   - Type: `purrfectstays.org`
   - Click "Verify"

2. **Configure DNS** (with your domain provider)
   - Log into your domain registrar (GoDaddy, Namecheap, etc.)
   - Find DNS settings
   - Add these records:

   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 75.2.60.5 |
   | CNAME | www | your-site.netlify.app |

3. **Wait for Propagation**
   - DNS changes take 5 minutes to 48 hours
   - Netlify will show "Waiting for DNS propagation"
   - Check status at [whatsmydns.net](https://whatsmydns.net)

### 2.4 SSL Certificate Verification

**What you're doing**: Ensuring your site has HTTPS security.

1. **In Netlify Dashboard**
   - After DNS propagates
   - Click "Domain settings"
   - Scroll to "HTTPS"
   - Click "Verify DNS configuration"

2. **Provision Certificate**
   - Click "Provision certificate"
   - Wait 5-10 minutes
   - ✅ "Certificate provisioned" = Success

3. **Force HTTPS**
   - Toggle "Force HTTPS" to ON
   - All traffic now secure

---

## 3. Post-deployment Validation

### 3.1 Functionality Testing

**What you're doing**: Making sure everything works on the live site.

#### Complete User Journey Test:

1. **Open your live site**
   - Go to https://purrfectstays.org
   - Use incognito/private browser window

2. **Test Registration**
   - Fill in:
     - Name: Test User
     - Email: test@example.com
     - Location: (should auto-detect)
   - Click "Join Waitlist"
   - ✅ Should show 6-digit code screen

3. **Test Verification**
   - Enter the 6-digit code shown
   - Click "Verify"
   - ✅ Should proceed to quiz

4. **Test Quiz**
   - Answer all questions
   - Click "Submit"
   - ✅ Should show success page
   - ✅ Should receive welcome email

5. **Test Error Handling**
   - Try invalid email
   - Try wrong verification code
   - ✅ Should show helpful error messages

### 3.2 Performance Monitoring

**What you're doing**: Checking your site loads fast.

1. **Google PageSpeed Test**
   - Go to [pagespeed.web.dev](https://pagespeed.web.dev)
   - Enter: https://purrfectstays.org
   - Click "Analyze"
   - Target scores:
     - Mobile: 70+ (Good)
     - Desktop: 90+ (Good)

2. **Check Bundle Size**
   - In Netlify dashboard
   - Click on latest deploy
   - Look for "Deploy summary"
   - Total size should be < 2MB

### 3.3 Security Verification

**What you're doing**: Ensuring your site is secure.

1. **Check Browser DevTools**
   - Visit your site
   - Press F12 (opens DevTools)
   - Click "Network" tab
   - Refresh page
   - Click "Headers" for any request
   - ✅ Should NOT see any API keys
   - ✅ Should see security headers

2. **SSL Test**
   - Go to [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest)
   - Enter: purrfectstays.org
   - ✅ Should get "A" rating

3. **Check Console for Errors**
   - In DevTools "Console" tab
   - ❌ No "CORS" errors
   - ❌ No "CSP" errors
   - ❌ No exposed API keys

### 3.4 Error Monitoring Setup

**What you're doing**: Setting up alerts for any problems.

1. **Netlify Analytics** (if subscribed)
   - In site dashboard
   - Click "Analytics"
   - Shows visitor stats

2. **Google Analytics**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Select your property
   - Check "Realtime" → "Overview"
   - ✅ Should see active users

3. **Email Monitoring**
   - Log into [resend.com](https://resend.com)
   - Click "Emails" tab
   - ✅ Should see sent emails
   - Check for bounces/failures

---

## 4. Rollback Procedures

### 4.1 Emergency Rollback Steps

**What you're doing**: Quickly reverting to a previous working version if something goes wrong.

#### Immediate Rollback (< 5 minutes):

1. **Go to Netlify Dashboard**
   - Open your site dashboard
   - Click "Deploys" tab

2. **Find Last Working Deploy**
   - Look for green "Published" deploys
   - Find one before the broken deploy
   - Click on it

3. **Publish Previous Deploy**
   - Click "Publish deploy" button
   - Confirm by clicking "Publish deploy" again
   - ✅ Site reverts in 30 seconds

### 4.2 Data Backup Verification

**What you're doing**: Making sure your data is safe.

1. **Supabase Backups**
   - Go to Supabase dashboard
   - Click "Settings" → "Backups"
   - ✅ Verify "Daily backups" is ON
   - Note: Last backup time shown

2. **Download Current Data**
   - Click "SQL Editor"
   - Run:
     ```sql
     SELECT * FROM waitlist_users;
     ```
   - Click "Download CSV"
   - Save to safe location

### 4.3 Recovery Procedures

**What you're doing**: Steps to fix common deployment problems.

#### Problem: Site shows "Page not found"
1. Check Netlify deploy log
2. Look for "Failed" status
3. Click "View log"
4. Common fixes:
   - Missing environment variables
   - Build command error
   - Wrong publish directory

#### Problem: Features not working
1. Check browser console (F12)
2. Look for specific errors:
   - "401 Unauthorized" = API key issue
   - "CORS blocked" = Supabase settings
   - "Network error" = Service down

#### Problem: Emails not sending
1. Check Resend dashboard
2. Verify API key in Netlify
3. Check Supabase Edge Functions logs
4. Common issues:
   - Wrong API key
   - Domain not verified
   - Rate limit exceeded

---

## 5. Quick Reference

### 🚨 Emergency Contacts
- **Netlify Support**: support@netlify.com
- **Supabase Support**: support@supabase.com
- **Domain Issues**: Your registrar's support

### 📋 Deployment Checklist Summary

**Before Deploying:**
- [ ] Environment variables configured
- [ ] Local build succeeds
- [ ] All features tested locally
- [ ] Security headers verified

**During Deployment:**
- [ ] Netlify deploy succeeds
- [ ] Supabase URLs updated
- [ ] DNS configured
- [ ] SSL certificate active

**After Deployment:**
- [ ] All features work live
- [ ] No console errors
- [ ] Emails sending
- [ ] Analytics tracking

**If Problems Occur:**
- [ ] Check deploy logs
- [ ] Verify environment variables
- [ ] Test in incognito mode
- [ ] Rollback if needed

### 🎯 Success Indicators

Your deployment is successful when:
- ✅ Site loads at https://purrfectstays.org
- ✅ HTTPS padlock shows in browser
- ✅ Registration flow completes
- ✅ Emails are received
- ✅ No errors in console
- ✅ Analytics shows visitors

### 💡 Pro Tips

1. **Always test in incognito mode** - Avoids cache issues
2. **Keep backup of .env file** - Store securely
3. **Document any custom changes** - For future reference
4. **Monitor first 24 hours** - Catch issues early
5. **Set up status page** - For user communication

---

## Need Help?

If you encounter issues not covered here:

1. **Check the logs** - Most answers are there
2. **Search error messages** - Copy/paste into Google
3. **Ask in forums** - Netlify/Supabase communities
4. **Keep calm** - Everything is reversible

Remember: Deployment might seem complex, but you're just following a recipe. Take it step by step, and you'll have your site live in no time!

🎉 **Congratulations on launching Purrfect Stays!** 🐱