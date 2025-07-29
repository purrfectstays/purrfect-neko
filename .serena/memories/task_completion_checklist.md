# Purrfect Stays - Task Completion Checklist

## CRITICAL: Run After Every Task

### 1. Code Quality Checks (MUST PASS)
```bash
# Type checking - MUST have zero errors
npm run typecheck

# Linting - MUST have zero errors/warnings
npm run lint

# Build - MUST succeed without errors
npm run build
```

### 2. Security Verification
- [ ] Verify no `VITE_` prefixed sensitive keys
- [ ] Check CSP headers allow required APIs
- [ ] Test CORS policies with production domain
- [ ] Confirm Edge Functions have proper environment variables
- [ ] Verify RLS policies restrict data access appropriately
- [ ] Check browser devtools for exposed secrets

### 3. Performance Checks
- [ ] Bundle size analysis: `npm run analyze:bundle`
- [ ] Performance audit: `npm run perf:audit`
- [ ] Test loading times on slow connections
- [ ] Verify lazy loading works properly

### 4. Testing (When Available)
```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage
```

### 5. Environment Variables Security
- [ ] **Frontend Variables**: Only non-sensitive with `VITE_` prefix
- [ ] **Backend Variables**: NO `VITE_` prefix (server-only)
- [ ] **Service Role Key**: Only in Edge Functions, never frontend
- [ ] **API Keys**: Properly secured and not exposed to browser

### 6. External API Integration Tests
- [ ] Test geolocation services with timeout fallbacks
- [ ] Verify currency exchange rate API calls
- [ ] Test email services (Resend API)
- [ ] Validate Google Analytics tracking

### 7. Before Deployment
- [ ] Update environment variables with production URLs
- [ ] Test all external integrations in production environment
- [ ] Verify CSP/CORS headers work with production domain
- [ ] Run security audit for exposed credentials

## DO NOT COMMIT unless explicitly requested by user