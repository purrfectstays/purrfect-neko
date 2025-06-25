export const monitoring = {
  trackUserAction: (action: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log('User action:', action, data);
    }
  },
  
  trackError: (error: Error, context?: any) => {
    if (import.meta.env.DEV) {
      console.error('Error tracked:', error, context);
    }
  }
};