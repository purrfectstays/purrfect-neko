# Feature Request Template

## FEATURE:

[Describe the React component, feature, or user flow you want to build. Be specific about:
- What the user will see and interact with
- What data needs to be displayed or collected
- How it integrates with existing components
- Any Supabase database interactions needed]

Example: "Create a user profile settings component that allows users to update their personal information, change their email preferences, and upload a profile picture. The component should integrate with our existing user context and save changes to the Supabase database."

## EXAMPLES:

[Reference specific example files from the examples/ directory and explain how they should be used as patterns]

Example:
- `examples/components/form-component.tsx` - Use this pattern for form validation and error handling
- `examples/services/supabase-service.ts` - Follow this pattern for database operations
- `examples/hooks/use-async.ts` - Use for handling async operations with proper loading states

## DOCUMENTATION:

[List any external documentation, APIs, or resources that will be needed during development]

- React documentation: https://react.dev/reference/react
- Supabase documentation: https://supabase.com/docs/reference/javascript/
- Tailwind CSS: https://tailwindcss.com/docs
- [Any specific library docs if using new dependencies]

## OTHER CONSIDERATIONS:

[Include any gotchas, specific requirements, or important details that AI assistants commonly miss]

Example:
- Must work on mobile devices (responsive design required)
- Form needs to handle both creation and editing modes
- Images should be optimized and stored in Supabase Storage
- Component should be accessible (keyboard navigation, screen readers)
- Follow the existing dark theme color scheme (zinc/indigo)
- Validate data on both client and server side
- Handle offline scenarios gracefully
- Rate limiting considerations
- SEO considerations (if applicable)