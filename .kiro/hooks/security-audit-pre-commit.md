---
name: "Security Audit Pre-Commit"
trigger: "pre-commit"
description: "Automatically scan for exposed API keys and security vulnerabilities before commits"
enabled: true
---

# Security Audit Pre-Commit Hook

## Trigger
- **Event**: Before Git commit
- **Files**: All staged files
- **Frequency**: Every commit

## Actions

### 1. API Key Exposure Scan
```bash
# Scan for exposed API keys
grep -r "sb_secret_\|sb_publishable_\|re_[A-Za-z0-9_]\|github_pat_\|nfp_\|lin_api_\|sntryu_" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" .

# Check for hardcoded URLs
grep -r "https://.*\.supabase\.co" --include="*.ts" --include="*.tsx" src/

# Scan for console.log with sensitive data
grep -r "console\.log.*token\|console\.log.*key\|console\.log.*secret" --include="*.ts" --include="*.tsx" src/
```

### 2. Environment Variable Validation
```typescript
// Validate all required environment variables are present
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
}
```

### 3. TypeScript Compilation Check
```bash
# Ensure TypeScript compiles without errors
npx tsc --noEmit

# Check for critical linting errors
npx eslint src/ --max-warnings 0 --quiet
```

### 4. Bundle Size Validation
```bash
# Build and check bundle size
npm run build
BUNDLE_SIZE=$(du -sk dist/ | cut -f1)
MAX_SIZE=512  # 512KB limit

if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
  echo "❌ Bundle size ${BUNDLE_SIZE}KB exceeds limit of ${MAX_SIZE}KB"
  exit 1
fi
```

## Success Criteria
- ✅ No exposed API keys found
- ✅ No hardcoded sensitive URLs
- ✅ TypeScript compilation successful
- ✅ Bundle size under 512KB
- ✅ No critical linting errors

## Failure Actions
- **Block commit** if security issues found
- **Display detailed error report**
- **Suggest fixes** for common issues
- **Log security violations** for audit

## Integration with MCP
- **GitHub MCP**: Create security issue if violations found
- **Linear MCP**: Track security improvements needed
- **Sentry MCP**: Log security audit results

---

*This hook ensures every commit maintains our security standards established this morning.*