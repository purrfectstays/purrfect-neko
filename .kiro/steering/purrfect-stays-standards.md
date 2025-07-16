---
inclusion: always
---

# Purrfect Stays Development Standards

## Security Standards (CRITICAL)

### API Key Management
- **NEVER** commit API keys to repository
- **ALWAYS** use environment variables for secrets
- **ROTATE** keys immediately if exposed (as we did this morning)
- **VALIDATE** key formats in configuration files
- **AUDIT** for exposed keys before every commit

### Current Secure Keys (Post-Rotation - January 17, 2025)
- ✅ Supabase Anon: `sb_publishable_t9qTtsvsmmU_wfVDyL-rjQ_g5mFNbST` (ROTATED)
- ✅ Supabase Service: `sb_secret_cDwJx30u4dozkmX4Jp_TWQ_kaNQm5Sl` (ROTATED)
- ✅ Resend API: `re_ccM4cgVw_9eiuFnJBsJqcSBpxeotUnxVS` (ROTATED)
- ⚠️ MCP Tokens: Require rotation (see MCP security section below)

### Memory Management
- **ALWAYS** clean up setTimeout/setInterval in useEffect
- **IMPLEMENT** proper cleanup patterns for all async operations
- **AVOID** memory leaks by clearing timeouts on component unmount

## Code Quality Standards

### TypeScript
- **AVOID** `any` types - use proper interfaces
- **COMPLETE** useEffect dependency arrays
- **REMOVE** unused imports and variables
- **MAINTAIN** strict TypeScript configuration

### React Patterns
- **USE** proper error boundaries for all critical routes
- **IMPLEMENT** loading states for all async operations
- **ENSURE** proper component cleanup on unmount
- **FOLLOW** React hooks best practices

### Performance
- **MAINTAIN** bundle size under 250KB gzipped
- **IMPLEMENT** lazy loading for heavy components
- **OPTIMIZE** images and assets
- **USE** proper code splitting strategies

## Accessibility Standards (WCAG 2.1 AA)

### Form Requirements
- **ALL** form inputs must have proper ARIA labels
- **ERROR** messages must use `role="alert"`
- **FORM** structure must be semantic HTML
- **KEYBOARD** navigation must work for all interactive elements

### Screen Reader Support
- **PROVIDE** meaningful alt text for images
- **USE** proper heading hierarchy (h1, h2, h3)
- **ENSURE** focus management in dynamic content
- **TEST** with actual screen readers when possible

## Deployment Standards

### Build Process
- **VERIFY** all builds complete without errors
- **TEST** critical user flows before deployment
- **MONITOR** bundle size and performance metrics
- **VALIDATE** environment variables in production

### Security Headers
- **IMPLEMENT** proper CSP headers
- **ENABLE** security headers (X-Frame-Options, etc.)
- **RESTRICT** CORS to specific domains
- **USE** HTTPS everywhere in production

## MCP Integration Standards

### MCP Security (CRITICAL - Exposed Tokens Found)
- ⚠️ **GitHub Token**: `github_pat_11BSXNMBI0***` (ROTATE IMMEDIATELY)
- ⚠️ **Netlify Token**: `nfp_7HY2JexAVrNoF9***` (ROTATE IMMEDIATELY)
- ⚠️ **Linear API Key**: `lin_api_nB5hCeTbbrI4***` (ROTATE IMMEDIATELY)
- ⚠️ **Sentry Token**: `sntryu_3456b0513fe2***` (ROTATE IMMEDIATELY)
- ⚠️ **Old Resend Key**: `re_4kfSKN47_***` (UPDATE TO MATCH .ENV)

### Server Configuration
- **SECURE** all MCP server tokens (URGENT: See exposed tokens above)
- **ROTATE** tokens monthly as configured
- **MONITOR** MCP server health and connectivity
- **DOCUMENT** all MCP capabilities and usage

### Development Workflow
- **USE** MCP servers for deployment operations
- **LEVERAGE** GitHub MCP for issue management
- **MONITOR** via Netlify MCP for build status
- **DEBUG** email issues via Resend MCP

## Error Handling Standards

### Production Errors
- **IMPLEMENT** comprehensive error boundaries
- **LOG** errors appropriately (no sensitive data)
- **PROVIDE** user-friendly error messages
- **MONITOR** error rates and patterns

### Development Debugging
- **REMOVE** console.log statements from production
- **USE** proper logging levels
- **IMPLEMENT** conditional debug logging
- **AVOID** logging sensitive information

## Testing Standards

### Critical Flows
- **TEST** registration → verification → quiz → success flow
- **VERIFY** email functionality works end-to-end
- **VALIDATE** accessibility with screen readers
- **CHECK** mobile responsiveness on real devices

### Performance Testing
- **MONITOR** page load times (target: <3s)
- **CHECK** memory usage and leaks
- **VALIDATE** bundle sizes after changes
- **TEST** under various network conditions

## Documentation Standards

### Code Documentation
- **DOCUMENT** complex business logic
- **EXPLAIN** security-related code
- **PROVIDE** examples for reusable components
- **MAINTAIN** up-to-date README files

### Deployment Documentation
- **KEEP** deployment guides current
- **DOCUMENT** environment variable requirements
- **MAINTAIN** troubleshooting guides
- **UPDATE** security procedures

---

*These standards reflect the high-quality, secure, accessible platform we've built for Purrfect Stays.*