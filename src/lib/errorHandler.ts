/**
 * Global Error Handler for Abort Errors
 * Silently handles all AbortController/AbortSignal related errors
 */

// BULLETPROOF ABORT ERROR DETECTION
export const isAbortError = (error: unknown): boolean => {
  if (!error) return false;
  
  // Convert to string for comprehensive checking
  const errorString = String(error).toLowerCase();
  const errorMessage = error instanceof Error ? (error.message || '').toLowerCase() : '';
  const errorName = error instanceof Error ? (error.name || '').toLowerCase() : '';
  
  // Check for AbortController.signal.aborted
  if (error instanceof Error && 'cause' in error && error.cause) {
    const causeString = String(error.cause).toLowerCase();
    if (causeString.includes('abort') || causeString.includes('signal')) {
      return true;
    }
  }
  
  // Ultra-comprehensive abort detection patterns
  const abortPatterns = [
    'aborterror',
    'aborted',
    'signal is aborted',
    'abort',
    'signal is aborted without reason',
    'operation was aborted',
    'the operation was aborted',
    'request aborted',
    'abortcontroller',
    'signal aborted',
    'abort signal',
    'cancelled',
    'operation cancelled'
  ];
  
  return abortPatterns.some(pattern => 
    errorName.includes(pattern) || 
    errorMessage.includes(pattern) || 
    errorString.includes(pattern)
  );
};

// Global error handler for window errors
export const setupGlobalErrorHandler = () => {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    if (isAbortError(event.error)) {
      // Silently handle abort errors
      event.preventDefault();
      return;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (isAbortError(event.reason)) {
      // Silently handle abort errors
      event.preventDefault();
      return;
    }
  });
};

// Override console.error to filter out AbortErrors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Check if any argument is an abort error
  const hasAbortError = args.some(arg => isAbortError(arg));
  
  if (hasAbortError) {
    // Silently ignore abort errors
    return;
  }
  
  // Call original console.error for non-abort errors
  originalConsoleError.apply(console, args);
};

// Override console.warn to filter out AbortErrors
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  // Check if any argument is an abort error
  const hasAbortError = args.some(arg => isAbortError(arg));
  
  if (hasAbortError) {
    // Silently ignore abort errors
    return;
  }
  
  // Call original console.warn for non-abort errors
  originalConsoleWarn.apply(console, args);
};

export default {
  isAbortError,
  setupGlobalErrorHandler
};