# Production Deployment Checklist

## ✅ Completed
- [x] Edge Function deployed to Supabase
- [x] Removed dummy user system
- [x] Real database operations implemented
- [x] CAPTCHA registration flow working
- [x] Quiz submission using WaitlistService

## 🔄 Environment Variables for Production

### Netlify Environment Variables
Add these in your Netlify Dashboard > Site Settings > Environment Variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_URL=https://your-custom-domain.com
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
NODE_ENV=production
```

### Supabase Edge Function Environment Variables
Add these in Supabase Dashboard > Edge Functions > send-welcome-email > Environment Variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
ALLOWED_ORIGINS=https://your-custom-domain.com,https://localhost:5173,https://localhost:5174
SITE_URL=https://your-custom-domain.com
```

## 🔄 CORS Settings

### Supabase CORS Configuration
Add these origins in Supabase Dashboard > Settings > API > CORS Origins:
- `https://your-custom-domain.com`
- `https://localhost:5173`
- `https://localhost:5174`

## 🔄 Domain-Specific Updates

### 1. Update netlify.toml (if needed)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 2. Update Supabase Auth Settings
- Site URL: `https://your-custom-domain.com`
- Redirect URLs: `https://your-custom-domain.com/**`

### 3. Update Resend Domain (if using custom domain)
- Verify your custom domain in Resend dashboard
- Update from address in Edge Function if needed

## 🚀 Deployment Steps

1. **Deploy to Netlify**:
   ```bash
   # Push to GitHub main branch
   git push origin main
   
   # Netlify will auto-deploy
   ```

2. **Test Production Flow**:
   - Registration with CAPTCHA
   - Quiz submission
   - Success page
   - Check Supabase database for real data

3. **Monitor**:
   - Check Netlify deployment logs
   - Monitor Supabase Edge Function logs
   - Test email functionality (if enabled)

## 🐛 Troubleshooting

### Common Issues:
- **CORS errors**: Check Supabase CORS settings
- **Edge Function failures**: Check environment variables
- **Database errors**: Verify service role key
- **Email issues**: Check Resend API key

### Debug Tools:
- Netlify Function logs
- Supabase Edge Function logs
- Browser Network tab
- Supabase database logs

## 📊 Post-Deployment Verification

- [ ] Registration flow works end-to-end
- [ ] Quiz submission saves to database
- [ ] Success page shows correct data
- [ ] Analytics tracking works
- [ ] No console errors
- [ ] Mobile responsiveness
- [ ] Page load speed acceptable