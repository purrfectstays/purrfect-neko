# Create PRP for Purrfect Stays Features

## Feature file: $ARGUMENTS

Generate a complete PRP (Product Requirements Prompt) for feature implementation in the Purrfect Stays React/TypeScript/Supabase application. Ensure comprehensive context for AI-assisted development with self-validation capabilities.

## Research Process

1. **Codebase Analysis**
   - Search for similar React components and patterns
   - Identify TypeScript interfaces and types to extend
   - Review existing Tailwind CSS patterns
   - Check Supabase service patterns and RLS policies
   - Analyze test patterns for validation approach

2. **External Research**
   - React best practices and hooks documentation
   - Supabase documentation (auth, database, Edge Functions)
   - TypeScript patterns for the specific feature
   - Tailwind CSS utilities and responsive design
   - Performance optimization techniques

3. **Pattern Identification**
   - Component composition patterns from src/components/
   - Service layer patterns from src/services/
   - State management patterns using Context API
   - Error handling and loading states
   - Form validation with React Hook Form

## PRP Generation Requirements

Using PRPs/templates/prp_base.md as template:

### Critical Context to Include
- **Documentation URLs**: React, Supabase, TypeScript docs
- **Code Examples**: Components, services, hooks from this project
- **Patterns**: Existing implementations to follow
- **Security**: Supabase RLS, input validation, CORS
- **Performance**: Lazy loading, memoization patterns

### Implementation Blueprint Must Include
- Component hierarchy and props interfaces
- TypeScript types and interfaces
- Service layer integration points
- State management approach
- Error handling strategy
- Loading and success states
- Responsive design requirements

### Validation Gates (Must be Executable)
```bash
# TypeScript validation
npm run typecheck

# Linting
npm run lint

# Build test
npm run build

# Component tests (when applicable)
npm run test
```

### React/TypeScript Specific Sections
- Props interface definitions
- Custom hooks requirements
- Context integration points
- Component composition strategy
- Event handler patterns
- Side effect management

### Supabase Integration Points
- Database queries with types
- RLS policies needed
- Edge Function endpoints
- Real-time subscriptions (if needed)
- Authentication flows

*** CRITICAL: Before writing the PRP ***

*** ULTRATHINK about the implementation approach considering: ***
- React component lifecycle and performance
- TypeScript type safety throughout
- Supabase security and efficiency
- User experience and accessibility
- Mobile-first responsive design

## Output
Save as: `PRPs/{feature-name}.md`

## Quality Checklist
- [ ] All TypeScript interfaces defined
- [ ] React patterns match existing code
- [ ] Supabase queries are type-safe
- [ ] Validation commands included
- [ ] Error states documented
- [ ] Responsive design considered
- [ ] Performance optimizations noted
- [ ] Security measures outlined

Score the PRP on a scale of 1-10 for one-pass implementation success.

Remember: The goal is comprehensive context that enables error-free, type-safe implementation following Purrfect Stays patterns.