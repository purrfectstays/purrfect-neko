# 🌐 Manual Domain Setup for Purrfect Stays

## Current Situation
The automated domain setup is failing, but we can easily set this up manually. Your project is built and ready for deployment.

## Step-by-Step Domain Setup

### 1. 🚀 Deploy to Netlify First

#### Option A: Quick Drag & Drop (Recommended)
1. **Build your project locally:**
   ```bash
   npm run build
   ```

2. **Go to Netlify Drop:** https://app.netlify.com/drop

3. **Drag your `dist` folder** to the deployment area

4. **Note your temporary URL** (e.g., `amazing-cat-123456.netlify.app`)

#### Option B: Git Integration
1. Push your code to GitHub
2. Connect repository in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### 2. 🏷️ Add Custom Domain

#### In Netlify Dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `purrfectstays.in` (or whatever domain you want)
4. Click **"Verify"**

### 3. 🌍 Configure DNS Records

At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www  
Value: your-site-name.netlify.app
```

**Replace `your-site-name.netlify.app` with your actual Netlify URL**

### 4. 🔒 SSL Certificate
Netlify will automatically provision an SSL certificate once DNS propagates (usually 5-30 minutes).

### 5. ⚙️ Update Environment Variables

#### In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:

```
VITE_SUPABASE_URL=https://wllsdbhjhzquiyfklhei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbHNkYmhqaHpxdWl5ZmtsaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTg0OTgsImV4cCI6MjA2NTMzNDQ5OH0.ky41Rcy9ZsmYStEIdC6jGqNer6WBcpbDVFvQs6Mk0Go
RESEND_API_KEY=re_bEG5WSmU_Q9P2NgsUnNMyAi1gkMgTpeFA
VITE_APP_URL=https://your-domain.com
VITE_GA_MEASUREMENT_ID=G-697M9S24V1
NODE_ENV=production
```

**Replace `https://your-domain.com` with your actual domain**

## 🎯 Alternative: Use a Free Domain

If you don't have a domain yet, here are some options:

### Free Options:
- **Freenom:** .tk, .ml, .ga domains (free)
- **GitHub Student Pack:** Free .me domain if you're a student
- **Use Netlify subdomain:** Keep the `your-app.netlify.app` URL

### Paid Options ($10-15/year):
- **Namecheap:** Great prices and interface
- **Google Domains:** Simple and reliable
- **Cloudflare:** Good for advanced users

## 🔧 Troubleshooting

### Domain Not Working?
- **Wait for DNS propagation** (up to 48 hours, usually much faster)
- **Check DNS propagation:** Use https://dnschecker.org
- **Verify DNS records** are correct at your registrar

### SSL Certificate Issues?
- Wait for DNS to fully propagate first
- Force SSL renewal in Netlify dashboard: **Domain settings** → **HTTPS** → **Renew certificate**

### Build Failures?
- Check build logs in Netlify dashboard
- Ensure all environment variables are set correctly
- Verify Node.js version compatibility

## 🚀 Quick Start Commands

```bash
# 1. Build the project
npm run build

# 2. Test the build locally (optional)
npm run preview

# 3. Deploy to Netlify (if using CLI)
npx netlify-cli deploy --prod --dir=dist
```

## 📋 Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] Deployed to Netlify
- [ ] Custom domain added in Netlify dashboard
- [ ] DNS records configured at domain registrar
- [ ] Environment variables set in Netlify
- [ ] SSL certificate active
- [ ] Site loads correctly on custom domain

## 🆘 Need Help?

If you're still having issues:

1. **Share your Netlify URL** - I can help debug
2. **Check Netlify build logs** - Look for specific error messages
3. **Verify domain ownership** - Make sure you can modify DNS records
4. **Try a different domain** - Sometimes specific domains have issues

## 🎉 After Setup

Once your domain is working:

1. **Test all functionality** on the live site
2. **Update email configuration** to use your custom domain
3. **Set up monitoring** and error tracking
4. **Configure analytics** to track your custom domain

---

**Need immediate help?** The drag-and-drop method to Netlify is the fastest way to get online, then you can add the custom domain afterward.