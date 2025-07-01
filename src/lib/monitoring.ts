interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

interface UserActionData {
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  [key: string]: any;
}

class MonitoringService {
  private sessionId: string;
  private errorQueue: Array<{ error: Error; context?: ErrorContext; timestamp: string }> = [];
  private actionQueue: Array<{ action: string; data?: UserActionData; timestamp: string }> = [];
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        new Error(event.reason || 'Unhandled Promise Rejection'),
        {
          component: 'Global',
          action: 'unhandledrejection',
          url: window.location.href,
          userAgent: navigator.userAgent,
        }
      );
    });
    
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(
        new Error(event.message || 'JavaScript Error'),
        {
          component: 'Global',
          action: 'javascript_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }
      );
    });
  }
  
  trackUserAction(action: string, data?: UserActionData): void {
    const enrichedData: UserActionData = {
      ...data,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('User action:', action, enrichedData);
    }
    
    // Store in queue for potential batch sending
    this.actionQueue.push({
      action,
      data: enrichedData,
      timestamp: new Date().toISOString(),
    });
    
    // Keep queue size manageable
    if (this.actionQueue.length > 100) {
      this.actionQueue = this.actionQueue.slice(-50);
    }
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        custom_parameter_sessionId: this.sessionId,
        ...data,
      });
    }
  }
  
  trackError(error: Error, context?: ErrorContext): void {
    const enrichedContext: ErrorContext = {
      ...context,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      stack: error.stack,
      message: error.message,
      name: error.name,
    };
    
    // Always log errors
    console.error('Error tracked:', error, enrichedContext);
    
    // Store in queue
    this.errorQueue.push({
      error,
      context: enrichedContext,
      timestamp: new Date().toISOString(),
    });
    
    // Keep queue size manageable
    if (this.errorQueue.length > 50) {
      this.errorQueue = this.errorQueue.slice(-25);
    }
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_parameter_sessionId: this.sessionId,
        custom_parameter_component: context?.component,
        custom_parameter_action: context?.action,
      });
    }
  }
  
  trackPerformance(metric: string, value: number, context?: any): void {
    const data = {
      metric,
      value,
      context,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    
    if (import.meta.env.DEV) {
      console.log('Performance metric:', data);
    }
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: metric,
        value: value,
        custom_parameter_sessionId: this.sessionId,
        ...context,
      });
    }
  }
  
  getSessionId(): string {
    return this.sessionId;
  }
  
  getErrorQueue(): Array<{ error: Error; context?: ErrorContext; timestamp: string }> {
    return [...this.errorQueue];
  }
  
  getActionQueue(): Array<{ action: string; data?: UserActionData; timestamp: string }> {
    return [...this.actionQueue];
  }
  
  clearQueues(): void {
    this.errorQueue = [];
    this.actionQueue = [];
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();