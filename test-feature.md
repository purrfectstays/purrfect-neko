## FEATURE:

Create a simple "Share Success" button component that appears on the success page. When clicked, it should copy the current page URL to the clipboard and show a brief success message to the user.

## EXAMPLES:

- `examples/components/ui-component.tsx` - Use the ButtonExample pattern for the button styling and states
- `examples/hooks/use-async.ts` - Use for handling the async clipboard operation
- `examples/components/stateful-component.tsx` - Use for state management patterns

## DOCUMENTATION:

- MDN Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
- React useState: https://react.dev/reference/react/useState
- Tailwind CSS: https://tailwindcss.com/docs/responsive-design

## OTHER CONSIDERATIONS:

- Component should handle cases where clipboard API is not available
- Show visual feedback when copy succeeds or fails
- Button should be accessible with proper ARIA labels
- Use existing dark theme colors (zinc/indigo)
- Component should be small and focused (under 100 lines)
- Mobile-friendly design with touch targets