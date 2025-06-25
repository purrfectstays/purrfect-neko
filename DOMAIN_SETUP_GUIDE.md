# 🌐 Custom Domain Setup Guide for Purrfect Stays

## Overview
This guide will help you set up `purrfectstays.org` for email sending through Resend, so your verification and welcome emails come from `hello@purrfectstays.org` instead of `onboarding@resend.dev`.

## Step 1: Add Domain to Resend

1. **Log into your Resend dashboard**: https://resend.com/domains
2. **Click "Add Domain"**
3. **Enter your domain**: `purrfectstays.org`
4. **Click "Add Domain"**

## Step 2: Configure DNS Records

You'll need to add these DNS records to your domain registrar (where you bought purrfectstays.org):

### Required DNS Records:

#### SPF Record (TXT)
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

#### DKIM Record (CNAME)
```
Name: resend._domainkey
Type: CNAME
Value: resend._domainkey.resend.com
```

#### DMARC Record (TXT)
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@purrfectstays.org
```

## Step 3: Verify Domain in Resend

1. **After adding DNS records**, go back to Resend dashboard
2. **Click "Verify" next to your domain**
3. **Wait for verification** (can take up to 24 hours, usually much faster)
4. **Status should change to "Verified"**

## Step 4: Update Edge Functions

Once your domain is verified, update the edge functions to use your custom domain:

### Update Verification Email Function
```typescript
// In supabase/functions/send-verification-email/index.ts
// Change this line:
from: 'Purrfect Stays <onboarding@resend.dev>',
// To this:
from: 'Purrfect Stays <hello@purrfectstays.org>',
```

### Update Welcome Email Function
```typescript
// In supabase/functions/send-welcome-email/index.ts
// Change this line:
from: 'Purrfect Stays <hello@purrfectstays.org>',
// To: (it's already correct, just verify)
from: 'Purrfect Stays <hello@purrfectstays.org>',
```

## Step 5: Test Email Delivery

1. **Run the Testing Dashboard** in your app
2. **Check email tests** - they should now show success
3. **Test actual registration** to ensure emails are delivered
4. **Check spam folders** initially, as new domains may be filtered

## Common DNS Providers Instructions

### Cloudflare
1. Go to DNS tab in Cloudflare dashboard
2. Add records as shown above
3. Make sure proxy status is "DNS only" (gray cloud) for CNAME records

### GoDaddy
1. Go to DNS Management
2. Add TXT records for SPF and DMARC
3. Add CNAME record for DKIM

### Namecheap
1. Go to Advanced DNS
2. Add records as specified above
3. Save changes

### Google Domains
1. Go to DNS settings
2. Add custom resource records
3. Enter records as specified

## Verification Checklist

- [ ] Domain added to Resend
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS  
- [ ] DMARC record added to DNS
- [ ] Domain verified in Resend (status shows "Verified")
- [ ] Edge functions updated to use custom domain
- [ ] Email tests passing in Testing Dashboard
- [ ] Actual registration emails being delivered

## Troubleshooting

### Domain Not Verifying
- **Check DNS propagation**: Use https://dnschecker.org
- **Wait longer**: DNS changes can take up to 24 hours
- **Double-check records**: Ensure exact spelling and formatting

### Emails Going to Spam
- **New domain reputation**: Takes time to build
- **Check SPF/DKIM/DMARC**: All must be properly configured
- **Send test emails**: To different providers (Gmail, Outlook, etc.)

### Rate Limiting Issues
- **Resend limits**: 2 emails per second on free plan
- **Testing delays**: Our tests include automatic delays
- **Production usage**: Normal user registrations won't hit limits

## Production Deployment Notes

Once domain is verified and working:

1. **Update environment variables** in production:
   ```env
   RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
   SITE_URL=https://purrfectstays.org
   ```

2. **Deploy updated edge functions** to production

3. **Monitor email delivery** in Resend dashboard

4. **Set up email analytics** to track open rates and deliverability

## Support

If you encounter issues:
- **Resend Support**: https://resend.com/support
- **DNS Help**: Contact your domain registrar
- **Email Deliverability**: Check Resend documentation

## Next Steps After Setup

1. **Monitor deliverability** in Resend dashboard
2. **Set up email templates** for better branding
3. **Configure webhooks** for email events (optional)
4. **Set up email analytics** for tracking (optional)

---

**Status**: Ready for domain configuration
**Estimated Setup Time**: 15-30 minutes + DNS propagation time
**Priority**: High (required for production email functionality)