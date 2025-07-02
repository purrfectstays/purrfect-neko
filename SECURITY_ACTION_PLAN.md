# 🔐 URGENT: Security Action Plan - Pre-Launch

## 🚨 IMMEDIATE ACTIONS REQUIRED

### **1. Resend API Key Security (CRITICAL)**

**Current Status:** ⚠️ API key was exposed in README.md (now fixed)
**Current Key:** `re_eDrErBGV_FiTqQn5uVHt5oXVpKD9h8fTU`

**IMMEDIATE STEPS:**
1. **Login to Resend Dashboard**: https://resend.com/api-keys
2. **Revoke Current Key**: Delete key `re_eDrErBGV_FiTqQn5uVHt5oXVpKD9h8fTU`
3. **Generate New Key**: Create production API key with restricted permissions
4. **Update Environment Variables**:
   - Local `.env` file
   - Vercel environment variables
   - Supabase Edge Function secrets

### **2. Environment Variables Verification**

**Production Environment Variables for Vercel:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go

# Resend Configuration (REPLACE WITH NEW KEY)
RESEND_API_KEY=re_NEW_SECURE_KEY_HERE

# App Configuration
VITE_APP_URL=https://purrfectstays.org
SITE_URL=https://purrfectstays.org
NODE_ENV=production

# Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-697M9S24V1
```

### **3. Supabase Security Checklist**

**Verify in Supabase Dashboard:**
- [ ] **CORS Settings**: Add `https://purrfectstays.org` to allowed origins
- [ ] **API Keys**: Confirm anon key hasn't been compromised
- [ ] **RLS Policies**: Verify recent security policies are active
- [ ] **Edge Functions**: Update environment variables with new Resend key

### **4. Domain & SSL Verification**

**Check DNS Settings:**
- [ ] A/AAAA records point to Vercel
- [ ] SSL certificate is valid and active
- [ ] HTTPS redirect is working
- [ ] Security headers are properly set

---

## ✅ COMPLETION CHECKLIST

- [ ] Old Resend API key revoked
- [ ] New secure API key generated
- [ ] All environment variables updated in Vercel
- [ ] Supabase Edge Functions updated with new key
- [ ] Email sending tested with new key
- [ ] Full user registration flow tested
- [ ] Security headers verified in production
- [ ] SSL certificate confirmed active

**Timeline: Complete within 2 hours**
**Priority: BLOCKING for launch**

---

## 🔍 SECURITY VERIFICATION COMMANDS

After completing the above steps, verify security:

1. **Test Email Sending:**
   ```bash
   # Test registration with real email
   # Verify email delivery to inbox (not spam)
   ```

2. **Check Security Headers:**
   ```bash
   curl -I https://purrfectstays.org
   # Verify X-Frame-Options, CSP, HSTS headers
   ```

3. **Test CORS Configuration:**
   ```bash
   # Verify Supabase API calls work from domain
   # Check browser network tab for CORS errors
   ```

**⚠️ DO NOT LAUNCH until all security items are verified and working**