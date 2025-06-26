import { useEffect, useRef } from 'react';
import { analytics } from '../lib/analytics';

interface BehaviorTrackingOptions {
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackClickHeatmap?: boolean;
  trackFormInteractions?: boolean;
  trackMouseMovement?: boolean;
  sessionId?: string;
}

export const useBehaviorTracking = (
  pageName: string, 
  options: BehaviorTrackingOptions = {}
) => {
  const sessionStartTime = useRef<number>(Date.now());
  const scrollDepthTracked = useRef<Set<number>>(new Set());
  const mouseMovements = useRef<Array<{x: number, y: number, timestamp: number}>>([]);
  const formInteractions = useRef<Array<{field: string, action: string, timestamp: number}>>([]);

  const {
    trackScrollDepth = true,
    trackTimeOnPage = true,
    trackClickHeatmap = true,
    trackFormInteractions = true,
    trackMouseMovement = false,
    sessionId = `session_${Date.now()}`
  } = options;

  // Track page entry
  useEffect(() => {
    analytics.trackEvent('page_enter', 'behavior', pageName);
    
    // Track session start
    if (trackTimeOnPage) {
      analytics.trackEvent('session_start', 'engagement', pageName);
    }

    return () => {
      // Track page exit and time spent
      const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
      analytics.trackEvent('page_exit', 'behavior', pageName, timeSpent);
      
      if (trackTimeOnPage) {
        analytics.trackConversion('time_on_page', {
          page: pageName,
          duration_seconds: timeSpent,
          session_id: sessionId,
          engagement_quality: timeSpent > 60 ? 'high' : timeSpent > 30 ? 'medium' : 'low'
        });
      }
    };
  }, [pageName, sessionId, trackTimeOnPage]);

  // Scroll depth tracking
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollDepthTracked.current.has(milestone)) {
          scrollDepthTracked.current.add(milestone);
          analytics.trackEvent('scroll_depth', 'engagement', `${pageName}_${milestone}%`);
          
          analytics.trackConversion('scroll_milestone', {
            page: pageName,
            depth_percentage: milestone,
            session_id: sessionId,
            time_to_milestone: Math.round((Date.now() - sessionStartTime.current) / 1000)
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName, sessionId, trackScrollDepth]);

  // Click heatmap tracking
  useEffect(() => {
    if (!trackClickHeatmap) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const clickData = {
        page: pageName,
        element: target.tagName.toLowerCase(),
        element_id: target.id || 'none',
        element_class: target.className || 'none',
        element_text: target.textContent?.substring(0, 50) || 'none',
        x_position: Math.round((event.clientX / viewportWidth) * 100),
        y_position: Math.round((event.clientY / viewportHeight) * 100),
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        session_id: sessionId,
        timestamp: Date.now()
      };

      analytics.trackEvent('click_heatmap', 'behavior', `${pageName}_click`);
      analytics.trackConversion('click_tracking', clickData);

      // Track specific CTA clicks
      if (target.textContent?.toLowerCase().includes('register') || 
          target.textContent?.toLowerCase().includes('join') ||
          target.textContent?.toLowerCase().includes('get started')) {
        analytics.trackConversion('cta_click_heatmap', {
          ...clickData,
          cta_type: 'primary_conversion'
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pageName, sessionId, trackClickHeatmap]);

  // Form interaction tracking
  useEffect(() => {
    if (!trackFormInteractions) return;

    const handleFormInteraction = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target || !['input', 'select', 'textarea'].includes(target.tagName.toLowerCase())) {
        return;
      }

      const interactionData = {
        field: target.name || target.id || 'unnamed',
        action: event.type,
        timestamp: Date.now()
      };

      formInteractions.current.push(interactionData);

      analytics.trackFormInteraction(pageName, interactionData.field, interactionData.action);

      // Track form completion patterns
      if (event.type === 'blur' && target.value) {
        analytics.trackConversion('form_field_completion', {
          page: pageName,
          field_name: interactionData.field,
          field_type: target.type,
          value_length: target.value.length,
          session_id: sessionId,
          time_to_complete: Date.now() - sessionStartTime.current
        });
      }
    };

    const events = ['focus', 'blur', 'change', 'input'];
    events.forEach(eventType => {
      document.addEventListener(eventType, handleFormInteraction, true);
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleFormInteraction, true);
      });
    };
  }, [pageName, sessionId, trackFormInteractions]);

  // Mouse movement tracking (optional, for advanced heatmaps)
  useEffect(() => {
    if (!trackMouseMovement) return;

    let lastTrackTime = 0;
    const TRACK_INTERVAL = 1000; // Track every 1 second

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastTrackTime < TRACK_INTERVAL) return;
      
      lastTrackTime = now;
      const movement = {
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100),
        timestamp: now
      };

      mouseMovements.current.push(movement);
      
      // Limit array size to prevent memory issues
      if (mouseMovements.current.length > 100) {
        mouseMovements.current = mouseMovements.current.slice(-50);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [pageName, trackMouseMovement]);

  // Track user engagement quality
  useEffect(() => {
    const trackEngagement = () => {
      const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
      const scrollDepth = Math.max(...Array.from(scrollDepthTracked.current), 0);
      const formInteractionCount = formInteractions.current.length;
      
      let engagementScore = 0;
      if (timeSpent > 60) engagementScore += 30;
      if (timeSpent > 180) engagementScore += 20;
      if (scrollDepth >= 50) engagementScore += 25;
      if (scrollDepth >= 75) engagementScore += 15;
      if (formInteractionCount > 0) engagementScore += 10;

      const engagementLevel = engagementScore >= 70 ? 'high' : 
                             engagementScore >= 40 ? 'medium' : 'low';

      analytics.trackConversion('engagement_quality', {
        page: pageName,
        engagement_score: engagementScore,
        engagement_level: engagementLevel,
        time_spent: timeSpent,
        max_scroll_depth: scrollDepth,
        form_interactions: formInteractionCount,
        session_id: sessionId
      });
    };

    // Track engagement every 30 seconds and on page unload
    const interval = setInterval(trackEngagement, 30000);
    window.addEventListener('beforeunload', trackEngagement);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', trackEngagement);
    };
  }, [pageName, sessionId]);

  // Return tracking utilities for manual use
  return {
    trackCustomEvent: (eventName: string, data: any) => {
      analytics.trackConversion(`custom_${eventName}`, {
        page: pageName,
        session_id: sessionId,
        timestamp: Date.now(),
        ...data
      });
    },
    
    trackFormSubmission: (formName: string, success: boolean, errorDetails?: string) => {
      analytics.trackConversion('form_submission', {
        page: pageName,
        form_name: formName,
        success,
        error_details: errorDetails,
        session_id: sessionId,
        form_completion_time: Date.now() - sessionStartTime.current,
        total_interactions: formInteractions.current.length
      });
    },

    trackUserIntent: (intent: string, confidence: number) => {
      analytics.trackConversion('user_intent', {
        page: pageName,
        intent,
        confidence,
        session_id: sessionId,
        time_spent: Math.round((Date.now() - sessionStartTime.current) / 1000)
      });
    },

    getSessionData: () => ({
      sessionId,
      timeSpent: Math.round((Date.now() - sessionStartTime.current) / 1000),
      scrollDepth: Math.max(...Array.from(scrollDepthTracked.current), 0),
      formInteractions: formInteractions.current.length,
      mouseMovements: mouseMovements.current.length
    })
  };
};