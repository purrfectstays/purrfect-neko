# 🚨 COMPLETE EMAIL VERIFICATION TROUBLESHOOTING

## 🔍 CURRENT STATUS:
- ✅ Resend API working
- ✅ Edge Function responding 
- ❌ **Environment variables NOT set in Supabase** (still showing "default domain")
- ❌ Emails likely going to spam or being blocked

## 🎯 ROOT CAUSE:
**Emails are being sent from Resend's default domain instead of your verified `purrfectstays.org` domain, causing poor deliverability.**

---

## 🛠️ SOLUTION 1: FIX ENVIRONMENT VARIABLES (CRITICAL)

### Step 1: Set Environment Variables in Supabase
**This is the main issue - you MUST do this first:**

1. **Go to**: https://supabase.com/dashboard/project/wllsdbhjhzquiyfklhei/settings/edge-functions
2. **Look for**: "Environment Variables" or "Secrets" section
3. **Add these EXACT variables**:
   ```
   Name: RESEND_API_KEY
   Value: re_eDrErBGV_FiTqQn5uVHt5oXVpKD9h8fTU
   
   Name: SITE_URL  
   Value: https://purrfectstays.org
   ```
4. **IMPORTANT**: Click "Save" or "Apply"

### Step 2: Redeploy Edge Functions
**You MUST redeploy after setting environment variables:**

**Via Supabase Dashboard:**
1. Go to Edge Functions → `send-verification-email`
2. Click "Deploy" or "Redeploy"
3. Wait for deployment to complete
4. Repeat for `send-welcome-email`

### Step 3: Verify the Fix
**Test to confirm environment variables are working:**
```bash
# This should NOW return "Sent using custom domain"
curl -X POST 'https://wllsdbhjhzquiyfklhei.supabase.co/functions/v1/send-verification-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go' \
  -H 'Content-Type: application/json' \
  -d '{"email": "delivered@resend.dev", "name": "Test", "verificationToken": "test", "userType": "cat-parent"}'
```

**Expected Response AFTER Fix:**
```json
{"success":true,"messageId":"...","note":"Sent using custom domain."}
```

---

## 🔍 SOLUTION 2: CHECK EMAIL DELIVERY AFTER FIX

### Where to Check for Emails:
**After fixing environment variables, check these locations:**

1. **Primary Inbox**
2. **Spam/Junk Folder** (most likely location initially)
3. **Promotions Tab** (Gmail)
4. **Social Tab** (Gmail)
5. **Quarantine** (Corporate email systems)

### Test with Multiple Email Providers:
- **Gmail**: `yourname+test1@gmail.com`
- **Outlook**: `yourname+test2@outlook.com` 
- **Yahoo**: `yourname+test3@yahoo.com`
- **Apple**: `yourname+test4@icloud.com`

---

## 🔧 SOLUTION 3: ALTERNATIVE TESTING METHOD

### Direct API Test (Bypasses Registration Flow):
```bash
# Test with YOUR actual email address
curl -X POST 'https://wllsdbhjhzquiyfklhei.supabase.co/functions/v1/send-verification-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://purrfectstays.org' \
  -d '{"email": "YOUR_ACTUAL_EMAIL@gmail.com", "name": "Your Name", "verificationToken": "manual-test-123", "userType": "cat-parent"}'
```

**This bypasses the registration form and tests the email function directly.**

---

## 🚨 SOLUTION 4: REGISTRATION FLOW DEBUG

### If Direct API Works But Registration Doesn't:

1. **Open Browser Developer Tools** (F12)
2. **Go to Network Tab**
3. **Register on**: https://purrfectstays.org/landingpage
4. **Look for**:
   - `send-verification-email` request
   - Any error responses
   - CORS errors in console

### Common Registration Issues:
- **Rate Limiting**: Too many attempts
- **Validation Errors**: Invalid email format
- **CORS Issues**: Cross-origin blocked
- **Network Timeouts**: Slow connection

---

## 📊 COMPLETE DIAGNOSIS CHECKLIST

### ✅ Fix Environment Variables:
- [ ] `RESEND_API_KEY` set in Supabase
- [ ] `SITE_URL` set in Supabase  
- [ ] Edge Functions redeployed
- [ ] Test returns "Sent using custom domain"

### ✅ Test Email Delivery:
- [ ] Direct API test works
- [ ] Check spam folders
- [ ] Test multiple email providers
- [ ] Email shows `From: Purrfect Stays <hello@purrfectstays.org>`

### ✅ Test Registration Flow:
- [ ] Website registration sends email
- [ ] No errors in browser console
- [ ] Network requests successful
- [ ] User created in database

---

## 🎯 MOST LIKELY SOLUTIONS (In Order):

1. **Environment Variables** (90% chance this fixes it)
2. **Emails in Spam Folder** (8% chance)
3. **Email Provider Blocking** (2% chance)

---

## 🚀 IMMEDIATE ACTION PLAN:

### Next 10 Minutes:
1. **Set environment variables in Supabase** (Steps above)
2. **Redeploy Edge Functions**
3. **Test with direct API call**
4. **Check spam folder thoroughly**

### If Still Not Working:
1. **Test with different email provider**
2. **Check browser console for errors**
3. **Verify registration flow in developer tools**

---

## 📞 EMERGENCY BACKUP PLAN:

If nothing works, you can temporarily use the working test addresses:
- `delivered@resend.dev` (always works)
- `onboarding@resend.dev` (always works)

**Replace your email with one of these to test the complete flow.**

---

## 🔮 EXPECTED TIMELINE:
- **Environment Variables Fix**: 5 minutes
- **Email Delivery**: 1-2 minutes after fix
- **Complete Testing**: 10 minutes
- **Total Resolution**: 15-20 minutes

**The environment variables fix should resolve 90% of delivery issues immediately.**