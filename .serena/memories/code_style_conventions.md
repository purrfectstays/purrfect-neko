# Purrfect Stays - Code Style & Conventions

## TypeScript Conventions
- **Strict mode enabled** - no `any` types unless absolutely necessary
- **Use type inference** where possible, explicit types where helpful
- **Prefer interfaces over types** for object shapes
- **Use enums** for fixed sets of values
- **Generic types** for reusable components/hooks

## React Patterns
- **Functional components only** - no class components
- **Custom hooks** for reusable logic (prefix with `use`)
- **Memoization** for expensive computations (React.memo, useMemo)
- **Error boundaries** for graceful error handling
- **Suspense boundaries** for code splitting

## File Structure
- **Component files < 300 lines** - Split into smaller components if larger
- **One component per file** with clear, descriptive names
- **Organize by feature** in subdirectories
- **Use TypeScript interfaces** for all props and state
- **Export types separately** from `src/types/`

## Tailwind CSS Guidelines
- **Mobile-first responsive design** (use sm:, md:, lg: prefixes)
- **Dark theme by default** with indigo accent colors
- **Consistent spacing** using Tailwind's spacing scale
- **No custom CSS** unless absolutely necessary
- **Component variants** using cn() utility for conditional classes

## Naming Conventions
- **Components**: PascalCase (e.g., `UserProfileCard`)
- **Files**: PascalCase for components, camelCase for utilities
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`)
- **Services**: camelCase ending with `Service` (e.g., `emailService`)
- **Types**: PascalCase (e.g., `UserData`)

## Comments & Documentation
- **DO NOT ADD COMMENTS** unless explicitly requested
- **JSDoc comments** for exported functions and components when needed
- **Self-documenting code** preferred over comments