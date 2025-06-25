// Google Analytics 4 implementation with enhanced production features
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found. Analytics will not be tracked.');
    return;
  }

  // Create script tag for gtag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    // Enhanced ecommerce and conversion tracking
    send_page_view: true,
    anonymize_ip: true, // GDPR compliance
    allow_google_signals: false, // Disable advertising features for privacy
    cookie_flags: 'SameSite=None;Secure', // Enhanced cookie security
  });

  console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
};

// Track page views
export const trackPageView = (page_title: string, page_location?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title,
    page_location: page_location || window.location.href,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track conversion events
export const trackConversion = (event_name: string, parameters?: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', event_name, {
    ...parameters,
    send_to: GA_MEASUREMENT_ID,
  });
};

// Enhanced conversion tracking for waitlist funnel
export const analytics = {
  // User registration events
  trackRegistrationStart: () => {
    trackEvent('registration_start', 'engagement', 'waitlist_registration');
    trackConversion('begin_checkout', {
      currency: 'USD',
      value: 0,
      items: [{
        item_id: 'early_access_spot',
        item_name: 'Early Access Registration',
        category: 'membership',
        quantity: 1,
        price: 0
      }]
    });
  },

  trackRegistrationComplete: (userType: string, position?: number) => {
    trackEvent('registration_complete', 'conversion', userType, position);
    trackConversion('purchase', {
      transaction_id: `reg_${Date.now()}`,
      value: 0,
      currency: 'USD',
      items: [{
        item_id: 'early_access_spot',
        item_name: 'Early Access Registration',
        category: 'membership',
        quantity: 1,
        price: 0
      }]
    });
  },

  trackEmailVerification: (success: boolean = true) => {
    trackEvent('email_verified', 'engagement', success ? 'success' : 'failed');
    if (success) {
      trackConversion('email_verification_complete');
    }
  },

  trackQuizStart: (userType: string) => {
    trackEvent('quiz_start', 'engagement', userType);
  },

  trackQuizComplete: (userType: string, position?: number) => {
    trackEvent('quiz_complete', 'conversion', userType, position);
    trackConversion('sign_up', {
      method: 'email',
      user_type: userType,
      waitlist_position: position
    });
  },

  // Social sharing events
  trackSocialShare: (platform: string, position?: number) => {
    trackEvent('share', 'social', platform, position);
    trackConversion('share', {
      method: platform,
      content_type: 'waitlist_position',
      item_id: position?.toString()
    });
  },

  // User engagement events
  trackCTAClick: (cta_name: string, location: string) => {
    trackEvent('cta_click', 'engagement', `${cta_name}_${location}`);
  },

  trackPageScroll: (percentage: number) => {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
      trackEvent('scroll', 'engagement', `${percentage}%`);
    }
  },

  // Error tracking
  trackError: (error_type: string, error_message: string, error_id?: string) => {
    trackEvent('error', 'technical', error_type);
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error_message,
        fatal: false,
        error_id: error_id,
        error_type: error_type
      });
    }
  },

  // Chatbot interactions
  trackChatbotInteraction: (action: string, message_type?: string) => {
    trackEvent('chatbot_interaction', 'engagement', `${action}_${message_type || 'general'}`);
  },

  // Email deliverability tracking
  trackEmailDelivery: (email_type: string, status: 'sent' | 'delivered' | 'failed') => {
    trackEvent('email_delivery', 'communication', `${email_type}_${status}`);
  },

  // Performance tracking
  trackPerformance: (metric: string, value: number) => {
    trackEvent('performance', 'technical', metric, value);
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metric,
        value: value
      });
    }
  },

  // Feature usage tracking
  trackFeatureUsage: (feature: string, action: string) => {
    trackEvent('feature_usage', 'engagement', `${feature}_${action}`);
  },

  // Cattery exploration tracking
  trackCatterySearch: (location: string, radius: number, results: number) => {
    trackEvent('cattery_search', 'exploration', location, results);
    trackConversion('search', {
      search_term: location,
      search_radius: radius,
      search_results: results
    });
  },

  trackCatteryView: (cattery_name: string, distance?: number) => {
    trackEvent('cattery_view', 'exploration', cattery_name, distance);
  },

  // Enhanced funnel tracking
  trackFunnelStep: (step: string, user_type?: string) => {
    trackEvent('funnel_step', 'conversion', `${step}_${user_type || 'unknown'}`);
  },

  // Form interactions
  trackFormInteraction: (form_name: string, field_name: string, action: string) => {
    trackEvent('form_interaction', 'engagement', `${form_name}_${field_name}_${action}`);
  },

  // User session tracking
  trackSessionStart: () => {
    trackEvent('session_start', 'engagement', 'new_session');
  },

  trackSessionEnd: (duration_seconds: number) => {
    trackEvent('session_end', 'engagement', 'session_complete', duration_seconds);
  },

  // Conversion funnel tracking
  trackFunnelConversion: (from_step: string, to_step: string, user_type?: string) => {
    trackEvent('funnel_conversion', 'conversion', `${from_step}_to_${to_step}`, user_type ? 1 : 0);
    trackConversion('funnel_step', {
      from_step,
      to_step,
      user_type
    });
  }
};