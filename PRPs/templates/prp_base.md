name: "Purrfect Stays PRP Template - React/TypeScript/Supabase"
description: |

## Purpose
Template optimized for React/TypeScript/Supabase features with comprehensive context for AI-assisted development, ensuring type safety, proper state management, and seamless Supabase integration.

## Core Principles
1. **Context is King**: Include ALL React patterns, TypeScript types, and Supabase schemas
2. **Type Safety First**: Every piece of data must be properly typed
3. **Validation Loops**: TypeScript, ESLint, and build must pass
4. **Component Patterns**: Follow existing examples in examples/components/
5. **Dark Theme UI**: Consistent with zinc/indigo color scheme

---

## Goal
[What needs to be built - specific React feature or component flow]

## Why
- [User value and experience improvement]
- [Technical benefits (performance, maintainability)]
- [Business metrics impacted]

## What
[User-facing behavior and technical implementation details]

### Success Criteria
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no warnings
- [ ] Component renders correctly in all states
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Error states handle all edge cases
- [ ] Loading states provide good UX
- [ ] Accessibility requirements met

## All Needed Context

### Documentation & References
```yaml
# React/TypeScript Documentation
- url: https://react.dev/reference/react
  sections: [Specific hooks or APIs needed]
  
- url: https://www.typescriptlang.org/docs/
  sections: [Advanced types, generics if needed]

# Supabase Documentation  
- url: https://supabase.com/docs/reference/javascript/
  sections: [Specific client methods needed]
  
- url: https://supabase.com/docs/guides/database/
  sections: [RLS policies, triggers if needed]

# Internal Examples
- file: examples/components/form-component.tsx
  why: Form validation and error handling patterns
  
- file: examples/services/supabase-service.ts
  why: Supabase query patterns and error handling
  
- file: examples/hooks/use-async.ts
  why: Async state management patterns

# Tailwind CSS
- url: https://tailwindcss.com/docs
  sections: [Specific utilities needed]
```

### Current Component Tree
```
src/
├── components/
│   ├── [existing components]
│   └── [where new component fits]
├── services/
│   └── [relevant services]
├── hooks/
│   └── [relevant hooks]
└── types/
    └── [relevant types]
```

### Desired Implementation Structure
```
src/
├── components/
│   └── NewFeature/
│       ├── NewFeature.tsx          # Main component
│       ├── NewFeatureForm.tsx      # Sub-component
│       └── index.ts                # Barrel export
├── services/
│   └── newFeatureService.ts       # API/Supabase logic
├── hooks/
│   └── useNewFeature.ts           # Custom hook if needed
└── types/
    └── newFeature.ts              # TypeScript interfaces
```

### Known Patterns & Conventions
```typescript
// Component Props Pattern
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
  onAction?: (data: SomeType) => void;
  className?: string;
}

// Service Response Pattern
interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Form State Pattern
const [formData, setFormData] = useState<FormType>(initialState);
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Supabase Query Pattern
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .single();
```

## Implementation Blueprint

### TypeScript Interfaces
```typescript
// Define all interfaces needed for the feature
interface FeatureData {
  id: string;
  // ... all properties with proper types
}

interface FeatureProps {
  // Component props
}

interface FeatureState {
  // Component state shape
}
```

### Component Implementation Tasks

```yaml
Task 1: Create TypeScript interfaces
CREATE src/types/newFeature.ts:
  - Define all data interfaces
  - Export prop types for components
  - Include Supabase table types if needed

Task 2: Create service layer
CREATE src/services/newFeatureService.ts:
  - PATTERN: Follow examples/services/supabase-service.ts
  - Include proper error handling
  - Type all responses
  - Add input validation

Task 3: Create main component
CREATE src/components/NewFeature/NewFeature.tsx:
  - PATTERN: Follow examples/components/stateful-component.tsx
  - Use proper TypeScript for props
  - Implement all UI states (loading, error, success)
  - Add proper ARIA labels

Task 4: Create sub-components
CREATE src/components/NewFeature/[SubComponents].tsx:
  - Break down complex UI into smaller pieces
  - Keep components under 300 lines
  - Reuse existing UI components

Task 5: Add custom hook (if needed)
CREATE src/hooks/useNewFeature.ts:
  - PATTERN: Follow examples/hooks/use-async.ts
  - Handle complex state logic
  - Provide clean API for components

Task 6: Update barrel exports
MODIFY src/components/index.ts:
  - Export new components
  - Maintain alphabetical order
```

### Supabase Integration
```yaml
Database Changes (if needed):
  - Table: [table_name]
  - Columns: [new columns with types]
  - RLS Policy: [security rules]
  - Indexes: [performance optimizations]

Edge Functions (if needed):
  - Function: [function_name]
  - Trigger: [HTTP/Database trigger]
  - Environment vars: [required vars]
```

### State Management Strategy
```typescript
// Local State
- Form data
- UI state (modals, dropdowns)
- Temporary calculations

// Context (AppContext)
- User session data
- Global app state
- Shared configuration

// Server State (React Query/SWR if used)
- Cached API responses
- Background refetching
```

## Validation Loop

### Level 1: TypeScript & Linting
```bash
# Must pass with zero errors
npm run typecheck
npm run lint

# If errors, check:
# - Missing type annotations
# - Unused variables
# - Import order
```

### Level 2: Build Validation
```bash
# Must build successfully
npm run build

# Check for:
# - Import errors
# - Missing dependencies
# - Bundle size warnings
```

### Level 3: Component Testing Checklist
```typescript
// Manual testing checklist
- [ ] Component renders without errors
- [ ] All props work as expected
- [ ] Error states display correctly
- [ ] Loading states show properly
- [ ] Form validation works
- [ ] Responsive design correct
- [ ] Dark theme styling consistent
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
```

### Level 4: Integration Testing
```bash
# Start dev server
npm run dev

# Test scenarios:
1. Happy path flow
2. Error scenarios (network, validation)
3. Edge cases (empty data, max length)
4. Browser compatibility
5. Mobile responsiveness
```

## Final Validation Checklist
- [ ] TypeScript: `npm run typecheck` passes
- [ ] Linting: `npm run lint` passes  
- [ ] Build: `npm run build` succeeds
- [ ] No console errors in browser
- [ ] All UI states implemented
- [ ] Proper error messages for users
- [ ] Loading states prevent double-submission
- [ ] Forms have proper validation
- [ ] Accessibility: keyboard nav and ARIA labels
- [ ] Responsive: works on mobile/tablet/desktop
- [ ] Performance: no unnecessary re-renders
- [ ] Security: input validation, XSS prevention

---

## Common Pitfalls to Avoid
- ❌ Don't use `any` type - find or create proper types
- ❌ Don't skip error states - users need feedback
- ❌ Don't forget mobile responsive design
- ❌ Don't create new patterns - use examples/
- ❌ Don't bypass TypeScript errors with @ts-ignore
- ❌ Don't forget to handle loading states
- ❌ Don't expose sensitive data in console logs
- ❌ Don't use inline styles - use Tailwind classes

## Performance Considerations
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Lazy load heavy components
- Optimize images with proper sizing
- Debounce user input where appropriate
- Use proper keys in lists