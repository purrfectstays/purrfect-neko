interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  domContentLoaded?: number;
  loadComplete?: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  viewportSize: string;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observer?: PerformanceObserver;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Detect device type
    const width = window.innerWidth;
    this.metrics.deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    this.metrics.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    
    // Connection info
    const connection = (navigator as any).connection;
    this.metrics.connectionType = connection ? connection.effectiveType : 'unknown';

    // Monitor Web Vitals
    this.observeWebVitals();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Track DOM events
    this.trackDOMEvents();
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = (this.metrics.cls || 0) + clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  private observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        this.metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart;
      }
    });
  }

  private trackDOMEvents() {
    // Track when critical elements become visible
    const criticalElements = [
      '.hero-mobile',
      '.mobile-register',
      'form input[type="email"]'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementClass = entry.target.className;
          this.trackEvent('element_visible', {
            element: elementClass,
            timestamp: performance.now()
          });
        }
      });
    }, { threshold: 0.1 });

    // Observe critical elements when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.observeCriticalElements(observer, criticalElements);
      });
    } else {
      this.observeCriticalElements(observer, criticalElements);
    }
  }

  private observeCriticalElements(observer: IntersectionObserver, selectors: string[]) {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => observer.observe(element));
    });
  }

  private trackEvent(event: string, data: any) {
    // Only send performance data in production and with user consent
    if (process.env.NODE_ENV === 'production') {
      try {
        // Send to analytics (implement based on your analytics provider)
        console.log('Performance Event:', event, data);
      } catch (error) {
        // Silently fail to avoid breaking the app
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return this.metrics as PerformanceMetrics;
  }

  public reportMetrics() {
    const report = {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Report performance metrics
    this.trackEvent('performance_report', report);

    // Grade the performance
    const grade = this.gradePerformance();
    this.trackEvent('performance_grade', { grade, deviceType: this.metrics.deviceType });

    return report;
  }

  private gradePerformance(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const { fcp, lcp, fid, cls } = this.metrics;
    
    // Web Vitals thresholds
    const fcpGood = (fcp || 0) < 1800;
    const lcpGood = (lcp || 0) < 2500;
    const fidGood = (fid || 0) < 100;
    const clsGood = (cls || 0) < 0.1;

    const goodMetrics = [fcpGood, lcpGood, fidGood, clsGood].filter(Boolean).length;

    if (goodMetrics === 4) return 'excellent';
    if (goodMetrics >= 3) return 'good';
    if (goodMetrics >= 2) return 'needs-improvement';
    return 'poor';
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Report metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    performanceMonitor.reportMetrics();
  }, 3000); // Give time for metrics to stabilize
});