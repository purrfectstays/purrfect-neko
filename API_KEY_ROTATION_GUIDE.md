# 🔐 API Key Rotation - IMMEDIATE ACTION REQUIRED

**Priority**: 🚨 **CRITICAL**  
**Time Required**: 5 minutes  
**Status**: Ready to execute  

---

## 🎯 Step 1: Rotate Supabase Keys (2 minutes)

### **Action Required:**
1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Select your project: `fahqkxrakcizftopskki`

2. **Navigate to API Settings**:
   - Click: **Settings** → **API**
   - Scroll to: **Project API keys**

3. **Reset Service Role Key**:
   - Find: `service_role` key (starts with `sb_secret_`)
   - Click: **Reset** button
   - **Copy new key immediately** (you won't see it again!)
   - Store securely: `SUPABASE_SERVICE_ROLE_KEY=new_key_here`

4. **Reset Anonymous Key**:
   - Find: `anon public` key (starts with `sb_publishable_`)
   - Click: **Reset** button
   - **Copy new key immediately**
   - Store securely: `VITE_SUPABASE_ANON_KEY=new_key_here`

---

## 📧 Step 2: Rotate Resend API Key (1 minute)

### **Action Required:**
1. **Open Resend Dashboard**:
   - Go to: https://resend.com/api-keys
   - Login to your account

2. **Delete Old Key**:
   - Find key: `re_[YOUR_CURRENT_RESEND_KEY]`
   - Click: **Delete** (if it exists)

3. **Create New Key**:
   - Click: **Create API Key**
   - Name: `Purrfect Stays Production`
   - Permissions: **Full access**
   - **Copy new key immediately**
   - Store securely: `RESEND_API_KEY=new_key_here`

---

## 🌐 Step 3: Update Production Environment (2 minutes)

### **Netlify Environment Variables:**
1. **Open Netlify Dashboard**:
   - Go to: https://app.netlify.com
   - Select your site: `purrfectstays`

2. **Navigate to Environment Variables**:
   - Go to: **Site Settings** → **Environment Variables**

3. **Update All Three Keys**:
   ```bash
   # Replace these exact variable names:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=NEW_ANON_KEY_FROM_STEP_1
   SUPABASE_SERVICE_ROLE_KEY=NEW_SERVICE_ROLE_KEY_FROM_STEP_1
   RESEND_API_KEY=NEW_RESEND_KEY_FROM_STEP_2
   ```

4. **Click Save** for each variable

---

## ✅ Step 4: Verification Checklist

### **Immediate Verification:**
- [ ] New Supabase service role key copied and saved
- [ ] New Supabase anon key copied and saved  
- [ ] New Resend API key copied and saved
- [ ] All 3 keys updated in Netlify environment variables
- [ ] Old keys documented for rotation log

### **Test Deployment:**
```bash
# Trigger new build with new keys
git commit --allow-empty -m "Trigger build with rotated API keys"
git push origin main
```

### **Monitor Deployment:**
1. **Netlify Build Log**:
   - Check: https://app.netlify.com/sites/your-site/deploys
   - Verify: Build completes successfully
   - Status: Deploy successful

2. **Function Testing**:
   - Test: Registration form submission
   - Test: Email verification process
   - Verify: No API authentication errors

---

## 🚨 Security Notes

### **Key Security:**
- ✅ Old keys are now invalid and cannot be used
- ✅ New keys have restricted CORS configuration
- ✅ Server-side validation active
- ✅ Production environment isolated

### **Emergency Rollback:**
If any issues occur:
```bash
# Emergency rollback plan
1. Revert to previous Netlify deploy
2. Re-generate keys if needed
3. Contact support if issues persist
```

---

## 📋 Completion Confirmation

**When complete, you should have:**
- [ ] 3 new API keys generated and deployed
- [ ] Successful Netlify build with new keys
- [ ] Working registration and email verification
- [ ] No authentication errors in browser console
- [ ] Production environment secured

**Time to complete**: 5 minutes  
**Security level after completion**: Production-grade ✅

---

## 🚀 Ready for Next Step

Once API keys are rotated, proceed to:
- **Staging Deployment Testing** (10 minutes)
- **Critical Flow Verification** (5 minutes)
- **Performance Monitoring Setup** (5 minutes)

**This completes the critical security hardening phase.**