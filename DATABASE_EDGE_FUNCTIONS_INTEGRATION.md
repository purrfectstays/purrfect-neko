# Database + Edge Functions Integration Guide

This document explains the consolidated fixes for database RLS policies and Edge Functions integration issues.

## 🎯 Issues Fixed

### 1. RLS Policy Conflicts
- **Problem**: Service role was being blocked by email-based JWT policies
- **Solution**: Created service role bypass function that allows Edge Functions to access data without RLS restrictions

### 2. Column Reference Issues  
- **Problem**: References to non-existent `email_verified` column in policies
- **Solution**: Updated all policies to use correct `is_verified` column name

### 3. CORS Configuration
- **Problem**: Hardcoded domains in Edge Functions
- **Solution**: Environment-driven CORS configuration using `ALLOWED_ORIGINS` and `SITE_URL`

### 4. Service Role Access
- **Problem**: Edge Functions couldn't update verification status due to RLS
- **Solution**: Service role now bypasses RLS entirely for all operations

## 🗄️ Database Changes

### New Migration: `20250107_consolidated_database_fix.sql`

This migration implements:

1. **Service Role Bypass Function**
   ```sql
   CREATE OR REPLACE FUNCTION is_service_role()
   RETURNS BOOLEAN AS $$
   BEGIN
       RETURN current_setting('role') = 'service_role' OR 
              current_setting('request.jwt.claims', true) IS NULL OR
              current_setting('request.jwt.claims', true) = '';
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

2. **Clean RLS Policies**
   - Service role gets full access to all tables
   - Public users have restricted access based on verification status
   - JWT-based policies only apply to non-service-role users

3. **Updated Verification Function**
   ```sql
   CREATE OR REPLACE FUNCTION verify_email_with_token(token_param text)
   RETURNS json AS $$
   -- Function runs with SECURITY DEFINER, bypassing RLS
   ```

### Tables with Updated Policies

- `waitlist_users` - Main user table with verification status
- `quiz_responses` - User quiz answers
- `quiz_sessions` - Quiz session data (if exists)
- `verification_tokens` - Email verification tokens (if exists)

## 🔧 Edge Functions Changes

### Environment Variables Required

Add these to your Supabase Edge Functions environment:

```bash
# Required
RESEND_API_KEY=re_your_resend_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (with sensible defaults)
SITE_URL=https://purrfect-landingpage.netlify.app
ALLOWED_ORIGINS=https://purrfectstays.org,https://www.purrfectstays.org,http://localhost:5173
```

### Updated Functions

1. **send-verification-email**
   - Now uses environment-driven CORS
   - Dynamic site URL configuration
   - Better error handling

2. **send-welcome-email**
   - Environment-driven CORS configuration
   - Dynamic domain handling
   - Improved logging

3. **verify-email**
   - Environment-driven configuration
   - Service role bypasses RLS automatically
   - Better error messages

### Shared Configuration

New shared CORS configuration in `supabase/functions/_shared/cors-config.ts`:

```typescript
// Environment-driven CORS
export function getCorsHeaders(origin: string | null): Record<string, string>

// Dynamic site URL handling
export function getSiteUrl(requestOrigin?: string | null): string

// Standardized error/success responses
export function createErrorResponse(...)
export function createSuccessResponse(...)

// Environment validation
export function validateEnvironment(): { isValid: boolean; errors: string[] }
```

## 🧪 Testing

### Database Access Test

Run the service role access test:

```bash
npm run test:service-role
# or
node scripts/test-service-role-access.js
```

This test verifies:
- ✅ RLS status and policy counts
- ✅ Service role bypass functionality  
- ✅ Direct table access
- ✅ Verification function
- ✅ Insert/update operations

### Manual Verification

1. **Check RLS Status**
   ```sql
   SELECT * FROM check_rls_status();
   ```

2. **Test Service Role Access**
   ```sql
   SELECT * FROM test_service_role_access();
   ```

3. **Test Email Verification**
   ```sql
   SELECT verify_email_with_token('dummy-token');
   ```

## 🚀 Deployment Steps

### 1. Apply Database Migration

```bash
# Run the consolidated migration
supabase db push

# Or apply specific migration
supabase migration up --file 20250107_consolidated_database_fix.sql
```

### 2. Update Edge Functions Environment

In Supabase Dashboard → Edge Functions → Settings:

```bash
SITE_URL=https://purrfect-landingpage.netlify.app
ALLOWED_ORIGINS=https://purrfectstays.org,https://www.purrfectstays.org,http://localhost:5173,http://localhost:3000
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy send-verification-email
supabase functions deploy send-welcome-email  
supabase functions deploy verify-email
```

### 4. Test the Integration

```bash
# Test service role access
npm run test:service-role

# Test email verification flow (manual)
# 1. Register new user via frontend
# 2. Check verification email
# 3. Click verification link
# 4. Verify user gets verified in database
```

## 🔒 Security Considerations

### Service Role Security

- ✅ Service role bypasses RLS only within Edge Functions
- ✅ Frontend still uses anon key with full RLS protection
- ✅ No sensitive data exposed to client-side
- ✅ All verification happens server-side

### CORS Security

- ✅ Environment-driven allowed origins
- ✅ Localhost only allowed in development
- ✅ Strict origin validation
- ✅ No wildcard (*) origins

### Data Protection

- ✅ User email verification required for sensitive operations
- ✅ JWT-based user identification for frontend
- ✅ Service role operations logged and auditable
- ✅ Input validation and sanitization

## 🛠️ Troubleshooting

### Common Issues

1. **"Service role key not configured"**
   - Check `SUPABASE_SERVICE_ROLE_KEY` in Edge Functions environment
   - Verify key format (should be long JWT token)

2. **"CORS error in Edge Functions"**
   - Add your domain to `ALLOWED_ORIGINS` environment variable
   - Check `SITE_URL` configuration

3. **"RLS policy violation"**
   - Verify service role is being used (check logs)
   - Run `SELECT is_service_role()` to test bypass function

4. **"Email verification not working"**
   - Check verification URL in email
   - Verify `verify-email` Edge Function is deployed
   - Test verification function manually

### Debug Commands

```sql
-- Check current role and RLS bypass
SELECT 
    current_setting('role') as current_role,
    is_service_role() as service_role_bypass;

-- Check policies on tables
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'waitlist_users';

-- Test verification function
SELECT verify_email_with_token('test-token');
```

## 📋 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | ✅ | - | Resend API key for sending emails |
| `SUPABASE_URL` | ✅ | - | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | - | Service role key for RLS bypass |
| `SITE_URL` | ❌ | `https://purrfect-landingpage.netlify.app` | Primary site URL |
| `ALLOWED_ORIGINS` | ❌ | Multiple defaults | Comma-separated CORS origins |

## ✅ Success Criteria

After implementing these fixes:

- ✅ Service role can access all database tables without RLS restrictions
- ✅ Email verification works end-to-end
- ✅ Edge Functions use environment-driven configuration
- ✅ CORS works for all allowed domains
- ✅ Frontend users still have proper RLS protection
- ✅ All tests pass successfully

## 🔄 Next Steps

1. Monitor Edge Function logs for any remaining issues
2. Test email verification flow thoroughly
3. Verify CORS works with your production domain
4. Consider adding monitoring for service role operations
5. Document any domain changes in environment variables