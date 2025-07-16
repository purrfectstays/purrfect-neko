# 🚨 CRITICAL SECURITY ALERT - API KEY EXPOSURE

**IMMEDIATE ACTION REQUIRED** - Production API keys found in .env file

## 🔑 Exposed Keys Requiring Rotation

1. **Supabase Service Role Key**: `sb_secret_Ql7kWyihhXMnhuTBLVWxNw_GT4jc4tD`
   - **Risk**: Database admin access
   - **Action**: Regenerate in Supabase dashboard immediately

2. **Resend API Key**: `re_cUAj61Sw_Bwwxft7M9sNw66LRYDLdeVyn`
   - **Risk**: Email service abuse
   - **Action**: Regenerate in Resend dashboard

3. **Supabase Anonymous Key**: `sb_publishable_t9qTtsvsmU_wfDyL-rj0_g5mFNbST`
   - **Risk**: Lower (public key)
   - **Action**: Regenerate for security best practice

## 📋 Step-by-Step Security Fix

### Phase 1: Immediate Key Rotation (5 minutes)

1. **Supabase Keys**:
   - Go to https://supabase.com/dashboard
   - Project Settings → API
   - Click "Reset" on service role key
   - Copy new keys to secure location

2. **Resend API Key**:
   - Go to https://resend.com/api-keys
   - Delete existing key
   - Create new API key
   - Copy to secure location

### Phase 2: Update Environment (2 minutes)

1. **Update Local .env**:
   ```bash
   VITE_SUPABASE_URL=https://fahqkxrakcizftopskki.supabase.co
   VITE_SUPABASE_ANON_KEY=NEW_ANON_KEY_HERE
   SUPABASE_SERVICE_ROLE_KEY=NEW_SERVICE_ROLE_KEY_HERE
   RESEND_API_KEY=NEW_RESEND_KEY_HERE
   ```

2. **Update Production Environment**:
   - Netlify: Site Settings → Environment Variables
   - Replace all three keys with new values

### Phase 3: Security Hardening (3 minutes)

1. **Remove Hardcoded Fallback**:
   - Remove hardcoded Supabase URL from Edge Functions
   - Make environment variables required

2. **Add Security Headers**:
   - Implement CSP headers
   - Add HSTS headers

## ✅ Security Status

- [ ] Supabase service role key rotated
- [ ] Resend API key rotated  
- [ ] Supabase anon key rotated
- [ ] Local .env updated
- [ ] Production environment updated
- [ ] Hardcoded fallbacks removed
- [ ] Security headers added
- [ ] Git history verified clean

## 🛡️ Post-Fix Verification

```bash
# Test new keys work
npm run build
npm run dev

# Verify no old keys in codebase
grep -r "sb_secret_Ql7k\|re_cUAj61Sw\|sb_publishable_t9q" . || echo "Clean"
```

**Status**: Keys require immediate rotation before public deployment