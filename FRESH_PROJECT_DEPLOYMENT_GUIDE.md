# 🚀 FRESH SUPABASE PROJECT DEPLOYMENT GUIDE

**Status:** READY FOR EXECUTION  
**Last Updated:** 2025-01-07  
**Verification Status:** TRIPLE-CHECKED ✅

## 📋 **DEPLOYMENT STEPS**

### **STEP 1: RUN DATABASE MIGRATION**

1. Open your **new Supabase project** dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire contents of:
   ```
   supabase/migrations/20250107_fresh_project_setup.sql
   ```
4. Click **RUN** to execute the migration
5. ✅ **Expected Result:** You should see success messages with counts of tables, policies, and functions created

---

### **STEP 2: DEPLOY EDGE FUNCTIONS**

**Install Supabase CLI** (if not already installed):
```bash
npm install -g supabase
```

**Login to Supabase:**
```bash
supabase login
```

**Link to your new project:**
```bash
supabase link --project-ref [YOUR_NEW_PROJECT_ID]
```

**Deploy Edge Functions:**
```bash
# Deploy all functions at once
supabase functions deploy

# OR deploy individually for better control:
supabase functions deploy send-verification-email
supabase functions deploy verify-email  
supabase functions deploy send-welcome-email
```

---

### **STEP 3: SET ENVIRONMENT VARIABLES**

**In Supabase Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```env
RESEND_API_KEY=re_your_resend_api_key_here
SITE_URL=https://purrfect-landingpage.netlify.app
ALLOWED_ORIGINS=https://purrfect-landingpage.netlify.app,http://localhost:5173
```

**In Netlify Dashboard:**
1. Go to **Site Settings** → **Environment Variables**
2. Add these variables:

```env
VITE_SUPABASE_URL=https://[your-new-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-new-anon-key]
VITE_APP_URL=https://purrfect-landingpage.netlify.app
SUPABASE_SERVICE_ROLE_KEY=[your-new-service-role-key]
RESEND_API_KEY=re_your_resend_api_key_here
SITE_URL=https://purrfect-landingpage.netlify.app
```

---

### **STEP 4: UPDATE LOCAL ENVIRONMENT**

Update your local `.env` file:
```env
VITE_SUPABASE_URL=https://[your-new-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-new-anon-key]
VITE_APP_URL=https://purrfect-landingpage.netlify.app
SUPABASE_SERVICE_ROLE_KEY=[your-new-service-role-key]
RESEND_API_KEY=re_your_resend_api_key_here
```

---

### **STEP 5: COMMIT AND DEPLOY**

```bash
# Commit the changes
git add .
git commit -m "NEW PROJECT: Fresh Supabase setup with working email verification"
git push

# This will trigger automatic Netlify deployment
```

---

## 🧪 **TESTING CHECKLIST**

### **Database Verification:**
1. ✅ Check tables exist: `waitlist_users`, `quiz_responses`, `regional_limits`
2. ✅ Verify RLS is enabled on all tables
3. ✅ Test service role function: Run `SELECT test_service_role_access()`
4. ✅ Check policies: Run `SELECT * FROM check_rls_status()`

### **Edge Functions Verification:**
1. ✅ Functions deployed: Check Supabase dashboard Edge Functions tab
2. ✅ Environment variables set: Check both Supabase and Netlify
3. ✅ CORS configuration: Verify allowed origins include your domains

### **Email Verification Flow:**
1. ✅ Register new user on live site
2. ✅ Check email is received (including spam folder)
3. ✅ Click verification link
4. ✅ Verify redirect to success page
5. ✅ Confirm user is marked as verified in database
6. ✅ Complete quiz and check welcome email

---

## 🚨 **TROUBLESHOOTING**

### **If Migration Fails:**
- Check for syntax errors in SQL
- Ensure you're running on an empty database
- Verify you have proper permissions

### **If Edge Functions Fail:**
- Check environment variables are set correctly
- Verify Resend API key format (starts with `re_`)
- Check Supabase service role key is valid

### **If Emails Don't Send:**
- Verify Resend API key in Supabase environment variables
- Check CORS configuration includes your domains
- Look at Edge Function logs in Supabase dashboard

### **If RLS Blocks Operations:**
- Verify service role key is configured correctly
- Check `is_service_role()` function exists
- Ensure policies include service role bypass

---

## ✅ **SUCCESS CRITERIA**

**Migration Complete When:**
- ✅ All 3 tables created
- ✅ 6+ RLS policies active
- ✅ 4+ functions available
- ✅ Multiple indexes created
- ✅ Success message displays counts

**Deployment Complete When:**
- ✅ All Edge Functions deployed
- ✅ Environment variables configured
- ✅ Netlify redeploys successfully
- ✅ Email verification works end-to-end

---

## 📞 **SUPPORT**

If you encounter any issues:
1. Check the specific error messages
2. Verify all environment variables match exactly
3. Ensure Resend API key is valid and active
4. Confirm Supabase project has the correct plan/features

**The system is designed to be bulletproof - if something fails, it's typically a configuration issue that can be quickly resolved.**