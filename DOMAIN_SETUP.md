# Custom Domain Setup Guide

## Current Status
- Project built and ready for deployment
- Domain target: purrfectstays.in (as per .env.example)

## Manual Setup Steps

### 1. Deploy to Netlify
```bash
# Build the project
npm run build

# The dist/ folder contains your built application
```

### 2. Netlify Deployment Options

#### Option A: Drag & Drop
1. Go to https://app.netlify.com/drop
2. Drag your `dist` folder to the deployment area
3. Note your temporary Netlify URL (e.g., amazing-cat-123456.netlify.app)

#### Option B: Git Integration
1. Push your code to GitHub/GitLab
2. Connect repository in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### 3. Add Custom Domain

#### In Netlify Dashboard:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `purrfectstays.in`
4. Follow verification steps

#### DNS Configuration:
Add these records at your domain registrar:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: your-site-name.netlify.app
```

### 4. SSL Certificate
Netlify will automatically provision an SSL certificate once DNS is configured.

### 5. Update Environment Variables
Once deployed, update your production environment variables:
- `VITE_APP_URL=https://purrfectstays.in`
- Ensure all other environment variables are set in Netlify dashboard

## Troubleshooting

### Domain Not Working?
- DNS changes can take 24-48 hours to propagate
- Use DNS checker tools to verify propagation
- Ensure domain registrar allows external DNS management

### SSL Issues?
- Wait for DNS propagation to complete
- Force SSL renewal in Netlify dashboard if needed

### Build Failures?
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify build command and publish directory

## Alternative Platforms

### Vercel
```bash
npm i -g vercel
vercel --prod
```
Then add domain in Vercel dashboard.

### GitHub Pages
1. Push to GitHub repository
2. Enable Pages in repository settings
3. Configure custom domain

## Next Steps After Domain Setup

1. **Test the deployment thoroughly**
2. **Update email configuration** to use custom domain
3. **Set up monitoring** and analytics
4. **Configure CDN** if needed for better performance

## Support
If you continue having issues:
- Check Netlify documentation: https://docs.netlify.com/domains-https/custom-domains/
- Contact your domain registrar for DNS support
- Verify domain ownership and management permissions