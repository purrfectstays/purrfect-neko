# 🌐 Domain & Deployment Verification - Pre-Launch

## ✅ CORS Configuration Status: EXCELLENT

Your Supabase Edge Functions already have **production-ready CORS settings**:

```typescript
const allowedOrigins = [
  'https://purrfectstays.org',        // ✅ Production domain
  'https://www.purrfectstays.org',    // ✅ WWW variant  
  'https://purrfectstays.vercel.app', // ✅ Vercel default
  'http://localhost:5173',            // ✅ Development
  'http://localhost:3000'             // ✅ Development
];
```

---

## 🔍 VERIFICATION CHECKLIST

### **1. Domain DNS Configuration**

**Check DNS Records for purrfectstays.org:**
```bash
# A Record verification
dig A purrfectstays.org

# CNAME verification (if using CNAME)
dig CNAME purrfectstays.org

# SSL Certificate check
curl -I https://purrfectstays.org
```

**Expected Results:**
- [ ] A record points to Vercel IP addresses
- [ ] HTTPS redirects work properly  
- [ ] SSL certificate is valid and not expired
- [ ] Security headers are present

### **2. Vercel Domain Configuration**

**Verify in Vercel Dashboard:**
- [ ] Custom domain `purrfectstays.org` is added
- [ ] Domain status shows "Valid Configuration"
- [ ] SSL certificate is automatically provisioned
- [ ] Automatic HTTPS redirect is enabled

### **3. Environment Variables in Vercel**

**Required Production Environment Variables:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go

# Resend Configuration (UPDATE WITH NEW SECURE KEY)
RESEND_API_KEY=re_NEW_SECURE_KEY_HERE

# App Configuration  
VITE_APP_URL=https://purrfectstays.org
SITE_URL=https://purrfectstays.org
NODE_ENV=production

# Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-697M9S24V1
```

### **4. Supabase Edge Function Configuration**

**Update Edge Function Environment Variables:**
1. **Supabase Dashboard** → Project Settings → Edge Functions
2. **Add/Update Environment Variables:**
   ```env
   RESEND_API_KEY=re_NEW_SECURE_KEY_HERE
   SITE_URL=https://purrfectstays.org
   ```

---

## 🧪 TESTING PROCEDURES

### **Test 1: Domain Access & SSL**
```bash
# Test main domain
curl -I https://purrfectstays.org

# Test WWW redirect  
curl -I https://www.purrfectstays.org

# Test HTTP redirect to HTTPS
curl -I http://purrfectstays.org
```

**Expected Results:**
- Status: `200 OK` or `301/302` for redirects
- `Strict-Transport-Security` header present
- `X-Frame-Options: DENY` header present
- Valid SSL certificate (no warnings)

### **Test 2: API Connectivity**
```bash
# Test Supabase connection
curl -H "apikey: YOUR_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     https://wllsdbhjhzquiyfklhei.supabase.co/rest/v1/regional_limits

# Test Edge Function accessibility
curl -X OPTIONS https://wllsdbhjhzquiyfklhei.supabase.co/functions/v1/send-verification-email \
     -H "Origin: https://purrfectstays.org"
```

### **Test 3: Complete Registration Flow**
1. **Visit**: https://purrfectstays.org
2. **Navigate**: Landing → Registration 
3. **Fill Form**: Use real email address
4. **Submit**: Check for errors in browser console
5. **Verify Email**: Check inbox (and spam folder)
6. **Complete**: Follow verification link and complete quiz

---

## 🚨 LAUNCH BLOCKERS

**DO NOT LAUNCH if any of these fail:**

### **Critical Issues:**
- [ ] Domain doesn't resolve to Vercel
- [ ] SSL certificate errors or warnings
- [ ] CORS errors in browser console during registration
- [ ] Edge functions return 500 errors
- [ ] Email delivery completely failing

### **Security Issues:**
- [ ] Security headers missing (`X-Frame-Options`, `HSTS`, etc.)
- [ ] HTTP not redirecting to HTTPS
- [ ] CORS allowing unauthorized origins

### **Functionality Issues:**
- [ ] Registration form submission fails
- [ ] Email verification tokens not working
- [ ] Quiz submission errors
- [ ] Analytics not tracking events

---

## ⚡ QUICK FIXES FOR COMMON ISSUES

### **Issue 1: Domain Not Resolving**
**Solution:** Check DNS propagation (can take up to 48 hours)
```bash
# Check DNS propagation globally
dig @8.8.8.8 purrfectstays.org
dig @1.1.1.1 purrfectstays.org
```

### **Issue 2: CORS Errors**
**Solution:** Your CORS is already properly configured, but verify Supabase project URL matches

### **Issue 3: Email Not Sending**
**Solution:** 
1. Verify new Resend API key is updated everywhere
2. Check Resend dashboard for sending status
3. Test with different email providers

### **Issue 4: Environment Variables**
**Solution:**
1. Double-check all variables in Vercel dashboard
2. Ensure no trailing spaces or extra characters
3. Redeploy after updating variables

---

## 🎯 SUCCESS CRITERIA

**All systems go for launch when:**
- ✅ https://purrfectstays.org loads without errors
- ✅ Registration completes successfully
- ✅ Verification emails arrive in inbox
- ✅ Quiz completion works end-to-end
- ✅ No CORS or security errors in console
- ✅ Analytics events are firing correctly

**Estimated Verification Time:** 2-3 hours
**Critical Path:** Domain → Environment Variables → Email Testing → Full Flow Test