# Execute Purrfect Stays Feature PRP

Implement a feature for Purrfect Stays using the specified PRP file.

## PRP File: $ARGUMENTS

## Execution Process

1. **Load PRP & Context**
   - Read the specified PRP file completely
   - Understand all React/TypeScript/Supabase requirements
   - Review referenced examples and patterns
   - Identify all files that need creation or modification
   - Note validation criteria and success metrics

2. **ULTRATHINK Implementation Strategy**
   - Plan component hierarchy and data flow
   - Design TypeScript interfaces and types
   - Map out Supabase queries and RLS policies
   - Consider error states and edge cases
   - Plan responsive design breakpoints
   - Use TodoWrite to track implementation steps

3. **Execute Implementation**
   - Create/modify files following the PRP blueprint
   - Implement React components with proper TypeScript
   - Add service layer functions with error handling
   - Configure Supabase integration if needed
   - Apply Tailwind CSS with dark theme
   - Add loading and error states

4. **Validate Implementation**
   ```bash
   # Run each validation command
   npm run typecheck  # Must pass with no errors
   npm run lint       # Must pass with no errors
   npm run build      # Must build successfully
   ```
   - Fix any TypeScript errors
   - Resolve ESLint issues
   - Ensure build completes
   - Re-run until all pass

5. **Complete & Verify**
   - Ensure all PRP requirements met
   - Verify TypeScript types are comprehensive
   - Check responsive design works
   - Confirm error handling is robust
   - Run final validation suite
   - Update examples/ if new patterns introduced

6. **Quality Assurance**
   - Component follows React best practices
   - TypeScript provides full type safety
   - Supabase queries are optimized
   - UI is accessible and responsive
   - Performance considerations implemented

## React/TypeScript Specific Checks

- [ ] All props have TypeScript interfaces
- [ ] No `any` types unless justified
- [ ] Custom hooks follow naming convention
- [ ] Components are under 300 lines
- [ ] Error boundaries implemented where needed
- [ ] Memoization used appropriately
- [ ] Loading states are user-friendly

## Supabase Integration Checks

- [ ] Queries use proper types
- [ ] Error handling for failed requests
- [ ] RLS policies considered
- [ ] Connection reuse patterns followed
- [ ] Sensitive data not exposed

## Common Issues to Avoid

- Don't create new patterns when existing ones work
- Don't skip TypeScript validation
- Don't ignore responsive design
- Don't forget error states
- Don't bypass validation steps

Note: If validation fails, use error messages to fix issues. The PRP should contain enough context to resolve any problems.