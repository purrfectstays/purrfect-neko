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
  },

  // === MARKET RESEARCH & BUSINESS INTELLIGENCE TRACKING ===

  // Detailed quiz response tracking for pricing insights
  trackQuizResponse: (questionId: string, response: string | number, userType: string, questionIndex: number) => {
    trackEvent('quiz_response', 'market_research', `${questionId}_${userType}`, typeof response === 'number' ? response : 1);
    trackConversion('quiz_answer', {
      question_id: questionId,
      response_value: response,
      user_type: userType,
      question_number: questionIndex + 1,
      response_type: typeof response
    });
  },

  // Pricing tier preference tracking (CRITICAL for business strategy)
  trackPricingPreference: (userType: string, selectedTier: string, monthlyPrice?: number) => {
    trackEvent('pricing_preference', 'business_intelligence', `${userType}_${selectedTier}`);
    trackConversion('pricing_insight', {
      user_type: userType,
      preferred_tier: selectedTier,
      monthly_price: monthlyPrice,
      tier_category: selectedTier.includes('FREE') ? 'free' : 
                   selectedTier.includes('3.99') || selectedTier.includes('15') ? 'basic' :
                   selectedTier.includes('7.99') || selectedTier.includes('29') ? 'growth' : 'premium'
    });
  },

  // Geographic market insights
  trackGeographicInsight: (country: string, region: string, userType: string, regionalPosition: number) => {
    trackEvent('geographic_data', 'market_research', `${country}_${userType}`, regionalPosition);
    trackConversion('market_penetration', {
      country,
      region,
      user_type: userType,
      regional_position: regionalPosition,
      market_saturation: regionalPosition > 40 ? 'high' : regionalPosition > 20 ? 'medium' : 'low'
    });
  },

  // Business model validation
  trackBusinessModelInsight: (userType: string, frequency: string, budget: string, features: string[]) => {
    trackEvent('business_model_data', 'product_strategy', `${userType}_${frequency}`);
    trackConversion('market_validation', {
      user_type: userType,
      usage_frequency: frequency,
      budget_range: budget,
      desired_features: features.join(','),
      market_segment: userType === 'cattery-owner' ? 'b2b' : 'b2c'
    });
  },

  // Feature demand tracking
  trackFeatureDemand: (feature: string, importance: number, userType: string, willingness_to_pay?: string) => {
    trackEvent('feature_demand', 'product_development', `${feature}_${userType}`, importance);
    trackConversion('feature_validation', {
      feature_name: feature,
      importance_score: importance,
      user_type: userType,
      willingness_to_pay,
      demand_level: importance >= 8 ? 'high' : importance >= 6 ? 'medium' : 'low'
    });
  },

  // Competitive analysis insights
  trackCompetitiveInsight: (currentSolution: string, painPoint: string, userType: string) => {
    trackEvent('competitive_intelligence', 'market_research', `${currentSolution}_${userType}`);
    trackConversion('competitor_analysis', {
      current_solution: currentSolution,
      main_pain_point: painPoint,
      user_type: userType,
      opportunity_score: painPoint.includes('availability') ? 'high' : 
                        painPoint.includes('price') ? 'medium' : 'low'
    });
  },

  // Revenue opportunity tracking
  trackRevenueOpportunity: (userType: string, currentSpend: string, potentialValue: number) => {
    trackEvent('revenue_opportunity', 'business_intelligence', `${userType}_${currentSpend}`);
    trackConversion('revenue_validation', {
      user_type: userType,
      current_spending: currentSpend,
      potential_ltv: potentialValue,
      revenue_tier: potentialValue > 1000 ? 'enterprise' : 
                   potentialValue > 500 ? 'growth' : 'starter'
    });
  },

  // Market timing insights
  trackMarketTiming: (urgency: string, timeline: string, userType: string) => {
    trackEvent('market_timing', 'strategy', `${urgency}_${userType}`);
    trackConversion('timing_insight', {
      urgency_level: urgency,
      adoption_timeline: timeline,
      user_type: userType,
      market_readiness: urgency.includes('urgent') ? 'ready' : 'developing'
    });
  },

  // User journey completion tracking
  trackJourneyCompletion: (completionRate: number, userType: string, dropOffPoint?: string) => {
    trackEvent('journey_completion', 'funnel_analysis', userType, Math.round(completionRate * 100));
    trackConversion('journey_insight', {
      completion_rate: completionRate,
      user_type: userType,
      drop_off_point: dropOffPoint,
      journey_quality: completionRate > 0.8 ? 'excellent' : 
                      completionRate > 0.6 ? 'good' : 'needs_improvement'
    });
  },

  // Product-market fit indicators
  trackProductMarketFit: (userType: string, satisfaction: number, likelyToRecommend: number) => {
    trackEvent('product_market_fit', 'strategic_insights', userType, satisfaction);
    trackConversion('pmf_indicator', {
      user_type: userType,
      satisfaction_score: satisfaction,
      nps_score: likelyToRecommend,
      pmf_signal: likelyToRecommend >= 9 ? 'promoter' : 
                 likelyToRecommend >= 7 ? 'passive' : 'detractor'
    });
  },

  // Churn risk assessment
  trackChurnRisk: (userType: string, engagementLevel: string, timeToComplete: number) => {
    trackEvent('churn_risk', 'retention_insights', `${userType}_${engagementLevel}`);
    trackConversion('churn_indicator', {
      user_type: userType,
      engagement_level: engagementLevel,
      completion_time: timeToComplete,
      churn_risk: timeToComplete > 300 ? 'high' : 
                 timeToComplete > 120 ? 'medium' : 'low'
    });
  }
};