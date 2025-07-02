# 📧 Email System Testing Framework - Pre-Launch

## 🎯 CRITICAL EMAIL TESTING PROTOCOL

### **Phase 1: API Key Security Update**
**⚠️ MUST COMPLETE FIRST**

1. **Resend Dashboard Actions:**
   - Login to https://resend.com/api-keys
   - **Revoke**: `re_eDrErBGV_FiTqQn5uVHt5oXVpKD9h8fTU`
   - **Generate**: New production API key with domain restrictions
   - **Permissions**: Limit to `purrfectstays.org` sending domain

2. **Update All Locations:**
   - [ ] Local `.env` file
   - [ ] Vercel environment variables
   - [ ] Supabase Edge Function secrets

---

## 📋 EMAIL DELIVERABILITY TESTING

### **Test Matrix: Multiple Email Providers**

**Test with these email addresses:**
```
Gmail:    test.yourname+gmail@gmail.com
Outlook:  test.yourname+outlook@outlook.com  
Yahoo:    test.yourname+yahoo@yahoo.com
Apple:    test.yourname+apple@icloud.com
Custom:   test@your-domain.com (if available)
```

### **Test Scenarios:**

#### **Scenario 1: Registration Email Verification**
```bash
# Test Steps:
1. Visit https://purrfectstays.org/landingpage
2. Click "Join Early Access"
3. Fill registration form with test email
4. Submit form
5. Check email delivery within 2 minutes

# Success Criteria:
✅ Email arrives in inbox (not spam)
✅ Email renders correctly across clients
✅ Verification link works and loads correctly
✅ Clicking link completes verification
```

#### **Scenario 2: Welcome Email After Quiz**
```bash
# Test Steps:  
1. Complete verification from Scenario 1
2. Complete qualification quiz
3. Check for welcome email within 2 minutes

# Success Criteria:
✅ Welcome email arrives in inbox
✅ Contains correct waitlist position
✅ Social sharing links work
✅ All images and styling render correctly
```

#### **Scenario 3: Spam Filter Testing**
```bash
# Test Steps:
1. Repeat registration with multiple email providers
2. Check spam/junk folders if not in inbox
3. Note delivery times and placement

# Red Flags:
❌ Emails consistently going to spam
❌ Delivery times > 5 minutes
❌ Broken images or styling
❌ Verification links not working
```

---

## 🔍 EMAIL TEMPLATE VERIFICATION

### **Verification Email Checklist**
- [ ] **Subject Line**: Clear and professional
- [ ] **Sender**: Shows as "Purrfect Stays" not raw email
- [ ] **Logo**: Displays correctly (check network/firewall issues)
- [ ] **CTA Button**: "Verify Email" button works
- [ ] **Backup Link**: Text link works if button fails
- [ ] **Responsive**: Looks good on mobile email clients
- [ ] **Dark Mode**: Readable in dark mode email clients

### **Welcome Email Checklist**  
- [ ] **Personalization**: Uses correct name and user type
- [ ] **Waitlist Position**: Shows accurate position number
- [ ] **Sharing Links**: Social sharing buttons work
- [ ] **Next Steps**: Clear instructions for user
- [ ] **Contact Info**: Support links work correctly

---

## 🚨 TROUBLESHOOTING GUIDE

### **Issue 1: Emails Not Sending**
**Symptoms**: Registration succeeds but no email arrives
**Solutions**:
```bash
# Check Supabase Edge Function logs
# Verify new Resend API key is active
# Test API key directly:
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_NEW_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@purrfectstays.org",
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Test email delivery</p>"
  }'
```

### **Issue 2: Emails Going to Spam**
**Symptoms**: Emails delivered but in spam folder
**Solutions**:
- Check SPF/DKIM records for purrfectstays.org
- Verify sending domain is properly configured
- Test with different subject lines
- Check Resend reputation dashboard

### **Issue 3: Broken Email Templates**
**Symptoms**: Images not loading, styles broken
**Solutions**:
- Verify image URLs are accessible publicly
- Check Content Security Policy headers
- Test in multiple email clients (Gmail, Outlook, Apple Mail)

### **Issue 4: Verification Links Not Working**
**Symptoms**: Links in email don't work or lead to errors
**Solutions**:
- Verify domain configuration matches SITE_URL
- Check token generation and validation logic
- Test link expiration (24-hour window)

---

## 📊 EMAIL PERFORMANCE BENCHMARKS

### **Delivery Targets**
- **Delivery Time**: < 2 minutes for 95% of emails
- **Inbox Placement**: > 95% in inbox (not spam)
- **Click Rate**: > 80% of verification links clicked
- **Template Rendering**: Works in all major email clients

### **Volume Testing**
```bash
# Test burst capacity
# Register 10 users within 1 minute
# Verify all emails deliver successfully

# Test sustained load  
# Register 100 users over 1 hour
# Monitor delivery rates and timing
```

---

## ✅ EMAIL SYSTEM CERTIFICATION

**Email system is LAUNCH READY when:**

### **Functional Requirements**
- [ ] Verification emails deliver consistently < 2 minutes
- [ ] Welcome emails send after quiz completion
- [ ] All email templates render correctly across providers
- [ ] Verification links work reliably
- [ ] No CORS or API errors in Edge Function logs

### **Deliverability Requirements**
- [ ] > 95% inbox placement rate (not spam)
- [ ] Works across Gmail, Outlook, Yahoo, Apple Mail
- [ ] Mobile email client compatibility verified
- [ ] Unsubscribe mechanisms functional (if implemented)

### **Security Requirements**
- [ ] New Resend API key properly secured
- [ ] Domain authentication configured
- [ ] No sensitive data exposed in email content
- [ ] Rate limiting prevents abuse

---

## 🎯 FINAL EMAIL SYSTEM VALIDATION

**Complete this checklist before launch:**

1. **✅ API Security**
   - [ ] Old Resend API key revoked
   - [ ] New secure API key generated and deployed
   - [ ] All environment variables updated

2. **✅ Delivery Testing**
   - [ ] Test emails sent to all major providers
   - [ ] Delivery times under 2 minutes
   - [ ] Inbox placement verified (not spam)

3. **✅ Functionality Testing**
   - [ ] Complete registration flow tested end-to-end
   - [ ] Verification links work properly
   - [ ] Welcome emails trigger correctly
   - [ ] Email templates render properly

4. **✅ Performance Testing**
   - [ ] Burst testing completed (10 users in 1 minute)
   - [ ] Volume testing completed (100 users in 1 hour)
   - [ ] Edge Function performance verified

**🚀 Email system cleared for launch when all items checked**

---

**Estimated Testing Time: 3-4 hours**
**Critical Path: API Security → Basic Delivery → Full Flow → Performance**