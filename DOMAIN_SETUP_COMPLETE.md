# 🌐 Complete Domain Setup Guide for Purrfect Stays

## 🚀 Quick Start (Recommended Path)

Your project is **already built** and ready to deploy! The `dist` folder contains your production-ready application.

### Step 1: Deploy to Netlify (2 minutes)

#### Option A: Drag & Drop (Fastest)
1. **Go to:** https://app.netlify.com/drop
2. **Drag your `dist` folder** from your project to the deployment area
3. **Wait for deployment** (usually 30-60 seconds)
4. **Copy your temporary URL** (e.g., `amazing-cat-123456.netlify.app`)

#### Option B: Netlify CLI
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Deploy your built project
netlify deploy --prod --dir=dist
```

### Step 2: Add Custom Domain

#### In Netlify Dashboard:
1. Click on your deployed site
2. Go to **Site settings** → **Domain management**
3. Click **"Add custom domain"**
4. Enter your domain: `purrfectstays.in` (or your preferred domain)
5. Click **"Verify"**

### Step 3: Configure DNS Records

At your domain registrar, add these DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-netlify-subdomain].netlify.app
```

**Important:** Replace `[your-netlify-subdomain]` with your actual Netlify URL

### Step 4: Set Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**:

```
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go
RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
VITE_GA_MEASUREMENT_ID=G-697M9S24V1
VITE_APP_URL=https://purrfectstays.in
NODE_ENV=production
SITE_URL=https://purrfectstays.in
```

## 🏷️ Domain Options

### If you don't have a domain yet:

#### Free Options:
- **Use Netlify subdomain:** Keep the `your-app.netlify.app` URL (works immediately)
- **Freenom:** Free .tk, .ml, .ga domains
- **GitHub Student Pack:** Free .me domain (if you're a student)

#### Paid Options ($10-15/year):
- **Namecheap:** Great prices, easy interface
- **Google Domains:** Simple and reliable
- **Cloudflare:** Advanced features
- **GoDaddy:** Popular but more expensive

### Popular domain suggestions:
- `purrfectstays.com`
- `purrfectstays.in`
- `purrfectstays.app`
- `purrfect-stays.com`
- `cattery-booking.com`

## 🔧 DNS Configuration by Provider

### Cloudflare
1. Go to DNS → Records
2. Add A record: `@` → `75.2.60.5`
3. Add CNAME: `www` → `your-site.netlify.app`
4. Set proxy status to "DNS only" (gray cloud)

### Namecheap
1. Go to Domain List → Manage → Advanced DNS
2. Add A Record: Host `@`, Value `75.2.60.5`
3. Add CNAME: Host `www`, Value `your-site.netlify.app`

### GoDaddy
1. Go to DNS Management
2. Add A record: Name `@`, Value `75.2.60.5`
3. Add CNAME: Name `www`, Value `your-site.netlify.app`

### Google Domains
1. Go to DNS → Custom resource records
2. Add A record: Name `@`, Data `75.2.60.5`
3. Add CNAME: Name `www`, Data `your-site.netlify.app`

## 🔒 SSL Certificate

Netlify automatically provisions SSL certificates once DNS propagates (usually 5-30 minutes).

**If SSL fails:**
1. Wait for full DNS propagation (up to 48 hours)
2. Force renewal: Site settings → HTTPS → "Renew certificate"

## 🎯 Alternative Deployment Platforms

### Vercel
```bash
npm install -g vercel
vercel --prod
```
Then add domain in Vercel dashboard.

### GitHub Pages
1. Push to GitHub repository
2. Settings → Pages → Source: Deploy from branch
3. Configure custom domain

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 🔍 Troubleshooting

### Domain Not Working?
- **Check DNS propagation:** https://dnschecker.org
- **Wait 24-48 hours** for full propagation
- **Verify DNS records** are correct
- **Check domain registrar settings**

### Build Issues?
- **Check Netlify build logs** for specific errors
- **Verify environment variables** are set correctly
- **Ensure Node.js version** compatibility

### Email Issues?
- **Update edge functions** to use custom domain
- **Verify Resend domain** configuration
- **Test email delivery** after domain setup

## 📋 Post-Deployment Checklist

- [ ] Site loads on temporary Netlify URL
- [ ] Custom domain added in Netlify
- [ ] DNS records configured
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] All functionality works on live site
- [ ] Email delivery working
- [ ] Analytics tracking correctly
- [ ] Mobile responsiveness verified

## 🚨 Emergency Backup Plan

If domain setup fails:
1. **Use Netlify subdomain** temporarily
2. **Update VITE_APP_URL** to Netlify URL
3. **Test all functionality** works
4. **Add custom domain later** when ready

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com/domains-https/custom-domains/
- **DNS Help:** Contact your domain registrar
- **Build Issues:** Check Netlify build logs
- **Email Issues:** Verify Resend configuration

---

## 🎉 Success! What's Next?

Once your domain is live:

1. **Test thoroughly** - All features working?
2. **Monitor performance** - Set up error tracking
3. **Update email branding** - Use custom domain
4. **Share with users** - Your app is live!
5. **Set up monitoring** - Track uptime and performance

**Your Purrfect Stays app is ready to revolutionize cattery bookings! 🐱✨**