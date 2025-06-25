# 🌐 IONOS Domain Deployment Guide for Purrfect Stays

## Current Status
Your project is **BUILT and READY** to deploy! The `dist` folder contains your production-ready application with all domain references updated to `purrfectstays.org`.

## 🚀 Step-by-Step Deployment Process

### Step 1: Deploy to Netlify First

#### Option A: Drag & Drop (Fastest - 5 minutes)
1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Go to Netlify Drop:** https://app.netlify.com/drop

3. **Drag your `dist` folder** to the deployment area

4. **Wait for deployment** (30-60 seconds)

5. **Copy your temporary URL** (e.g., `amazing-cat-123456.netlify.app`)

#### Option B: Git Integration
1. Push your code to GitHub
2. Connect repository in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Step 2: Configure Your IONOS Domain

#### In IONOS Control Panel:
1. **Log into your IONOS account**
2. **Go to Domains & SSL** → **Manage Domains**
3. **Click on purrfectstays.org** → **DNS**

#### Add These DNS Records:

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www
Value: [your-netlify-subdomain].netlify.app
TTL: 3600
```

**Important:** Replace `[your-netlify-subdomain]` with your actual Netlify URL from Step 1

### Step 3: Add Custom Domain in Netlify

#### In Netlify Dashboard:
1. **Go to your deployed site**
2. **Site settings** → **Domain management**
3. **Click "Add custom domain"**
4. **Enter:** `purrfectstays.org`
5. **Click "Verify"**

### Step 4: Set Environment Variables in Netlify

#### In Netlify Dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go
RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
VITE_GA_MEASUREMENT_ID=G-697M9S24V1
VITE_APP_URL=https://purrfectstays.org
SITE_URL=https://purrfectstays.org
NODE_ENV=production
```

### Step 5: SSL Certificate (Automatic)

Netlify will automatically provision an SSL certificate once DNS propagates (usually 5-30 minutes).

## 🔧 IONOS-Specific DNS Configuration

### DNS Records to Add in IONOS:

#### Primary Domain (A Record)
```
Type: A
Host: @
Points to: 75.2.60.5
TTL: 3600 seconds
```

#### WWW Subdomain (CNAME)
```
Type: CNAME
Host: www
Points to: [your-netlify-url].netlify.app
TTL: 3600 seconds
```

### Optional: Email Setup (if you want hello@purrfectstays.org)

#### For Resend Email Service:
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600

Type: CNAME
Host: resend._domainkey
Points to: resend._domainkey.resend.com
TTL: 3600

Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@purrfectstays.org
TTL: 3600
```

## ⏱️ Timeline Expectations

- **DNS Propagation:** 5 minutes to 24 hours (usually 30 minutes)
- **SSL Certificate:** Automatic after DNS propagates
- **Full Setup Time:** 30 minutes to 2 hours

## 🔍 Verification Steps

### 1. Check DNS Propagation
Visit: https://dnschecker.org
Enter: purrfectstays.org
Verify: A record points to 75.2.60.5

### 2. Test Your Website
- Visit: https://purrfectstays.org
- Verify: SSL certificate is active (green lock icon)
- Test: All functionality works correctly

### 3. Verify Email (if configured)
- Send test email from your application
- Check: Emails come from hello@purrfectstays.org

## 🚨 Troubleshooting

### Domain Not Working?
1. **Check DNS propagation** at dnschecker.org
2. **Wait longer** - IONOS can take up to 24 hours
3. **Verify DNS records** are exactly as specified
4. **Clear browser cache** and try incognito mode

### SSL Certificate Issues?
1. **Wait for DNS propagation** to complete first
2. **Force renewal** in Netlify: Site settings → HTTPS → "Renew certificate"
3. **Check domain verification** in Netlify dashboard

### Build Issues?
1. **Check Netlify build logs** for specific errors
2. **Verify environment variables** are set correctly
3. **Test build locally** with `npm run build`

## 📞 Support Contacts

- **IONOS Support:** https://www.ionos.com/help
- **Netlify Support:** https://docs.netlify.com
- **DNS Issues:** Contact IONOS support directly

## 🎯 Quick Commands

```bash
# Build the project
npm run build

# Test the build locally
npm run preview

# Deploy via Netlify CLI (optional)
npx netlify-cli deploy --prod --dir=dist
```

## ✅ Deployment Checklist

- [ ] Project built successfully (`npm run build`)
- [ ] Deployed to Netlify (drag & drop or Git)
- [ ] DNS A record added in IONOS (@ → 75.2.60.5)
- [ ] DNS CNAME record added in IONOS (www → netlify-url)
- [ ] Custom domain added in Netlify dashboard
- [ ] Environment variables set in Netlify
- [ ] DNS propagation verified (dnschecker.org)
- [ ] SSL certificate active (https working)
- [ ] Website loads correctly on purrfectstays.org
- [ ] All functionality tested on live domain

## 🎉 Success!

Once complete, your Purrfect Stays website will be live at:
**https://purrfectstays.org**

The entire cat community will be able to access your revolutionary cattery booking platform! 🐱✨

---

**Need immediate help?** Start with the Netlify deployment first - you can add the custom domain afterward. The temporary Netlify URL will work immediately while DNS propagates.