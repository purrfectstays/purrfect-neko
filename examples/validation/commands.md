# Validation Commands for Purrfect Stays

This document outlines all validation commands used in the Context Engineering workflow to ensure code quality and consistency.

## Required Package.json Scripts

### Current Scripts (Existing)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Recommended Additional Scripts
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "validate": "npm run typecheck && npm run lint && npm run build"
  }
}
```

## Validation Workflow

### 1. TypeScript Type Checking
```bash
# Command to add to package.json
npm run typecheck

# What it does:
# - Validates all TypeScript types
# - Checks for type errors without emitting files
# - Ensures strict type safety

# Expected outcome: No TypeScript errors
```

**Common Issues & Solutions:**
- Missing type annotations → Add explicit types
- `any` types → Replace with proper interfaces
- Import errors → Check file paths and exports
- Missing properties → Update interfaces

### 2. ESLint Code Quality
```bash
# Current command (already exists)
npm run lint

# What it checks:
# - Code style consistency
# - React best practices
# - Hook dependencies
# - Unused variables
# - Import order

# Expected outcome: No linting errors or warnings
```

**Common Issues & Solutions:**
- Unused imports → Remove or comment with eslint-disable
- Hook dependency arrays → Add missing dependencies
- React rules violations → Follow React patterns from examples/

### 3. Build Validation
```bash
# Current command (already exists)
npm run build

# What it validates:
# - All imports resolve correctly
# - Bundle builds successfully
# - No runtime errors during build
# - Asset optimization works

# Expected outcome: Successful build with dist/ folder created
```

**Common Issues & Solutions:**
- Import path errors → Use correct relative/absolute paths
- Missing dependencies → Install required packages
- Bundle size warnings → Optimize imports and lazy loading

## Integration in PRPs

### Validation Commands in PRP Templates
Every PRP should include these validation steps:

```bash
# Level 1: TypeScript & Linting
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings

# Level 2: Build Test
npm run build        # Must complete successfully

# Level 3: Manual Testing
npm run dev          # Start dev server for manual testing
```

### Validation Checklist Template
```markdown
## Final Validation Checklist
- [ ] TypeScript: `npm run typecheck` passes
- [ ] Linting: `npm run lint` passes  
- [ ] Build: `npm run build` succeeds
- [ ] No console errors in browser
- [ ] Component renders in all states
- [ ] Responsive design works
- [ ] Accessibility validated
```

## Continuous Integration Setup

### GitHub Actions Workflow (Future)
```yaml
# .github/workflows/validate.yml
name: Validate Code
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

## TypeScript Configuration

### tsconfig.json Requirements
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## ESLint Configuration

### Key Rules for React/TypeScript
- `@typescript-eslint/no-explicit-any` - Prevent any types
- `react-hooks/exhaustive-deps` - Proper hook dependencies
- `@typescript-eslint/no-unused-vars` - Clean code
- `react/jsx-key` - List rendering keys

## Performance Validation

### Bundle Analysis
```bash
# Build with analysis
npm run build

# Check dist/bundle-analysis.html for:
# - Bundle size trends
# - Chunk splitting effectiveness
# - Dependency impact
```

### Performance Checklist
- [ ] No components over 300 lines
- [ ] Lazy loading for heavy features
- [ ] Proper memoization usage
- [ ] Optimized images and assets

## Security Validation

### Security Checklist
- [ ] No hardcoded secrets in code
- [ ] Input validation on all forms
- [ ] Proper error handling (no stack traces to users)
- [ ] HTTPS-only API calls
- [ ] Content Security Policy headers

## Accessibility Validation

### Manual Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
- [ ] ARIA labels where needed
- [ ] Focus management in modals

### Tools
- Browser DevTools Accessibility tab
- axe-core browser extension
- Lighthouse accessibility audit

## Mobile Validation

### Responsive Design Testing
- [ ] Mobile (375px width) - iPhone SE
- [ ] Tablet (768px width) - iPad
- [ ] Desktop (1024px+ width)
- [ ] Touch targets minimum 44px
- [ ] Readable text without zoom

## Error Handling Validation

### Error State Testing
- [ ] Network failure scenarios
- [ ] Invalid form submissions
- [ ] API timeout handling
- [ ] Offline state management
- [ ] User-friendly error messages

## Documentation Validation

### Code Documentation Checklist
- [ ] JSDoc comments on exported functions
- [ ] README updated for new features
- [ ] TypeScript interfaces documented
- [ ] Component prop descriptions
- [ ] Service method documentation

This validation framework ensures consistent, high-quality code that follows Purrfect Stays standards and patterns.