import React, { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';

// Singleton tracking to prevent multiple instances
let activeInstance: string | null = null;

/**
 * Enhanced Mobile sticky CTA bar with context awareness
 * - Singleton pattern to prevent multiple instances
 * - Hides during quiz to prevent overlap
 * - Smart positioning to avoid accidental clicks
 * - Respects user interaction zones
 * - Device-specific positioning
 */
const MobileStickyCTAEnhanced: React.FC = memo(() => {
  const instanceId = React.useRef(`cta-${Date.now()}-${Math.random()}`).current;
  const { setCurrentStep, currentStep } = useApp();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteractiveContent] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android' | 'mobile'>('mobile');

  useEffect(() => {
    // Implement singleton pattern - allow initial mount
    if (!activeInstance) {
      activeInstance = instanceId;
    } else if (activeInstance !== instanceId) {
      // Another instance exists, don't mount this one
      return;
    }
    
    setMounted(true);

    return () => {
      if (activeInstance === instanceId) {
        activeInstance = null;
      }
    };
  }, [instanceId]);

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      if (width >= 1024) {
        setDeviceType('desktop');
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        setDeviceType('ios');
      } else if (/android/.test(userAgent)) {
        setDeviceType('android');
      } else {
        setDeviceType('mobile');
      }
    };
    
    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  useEffect(() => {
    const checkVisibility = () => {
      // Hide on desktop
      if (deviceType === 'desktop' || window.innerWidth >= 1024) {
        setIsVisible(false);
        return;
      }

      // Hide during quiz, registration, or verification steps
      const hideOnSteps = ['quiz', 'registration', 'verification', 'success'];
      if (hideOnSteps.includes(currentStep)) {
        setIsVisible(false);
        return;
      }

      // Hide on specific routes
      const hideOnRoutes = ['/quiz', '/register', '/verify', '/success'];
      if (hideOnRoutes.some(route => location.pathname.includes(route))) {
        setIsVisible(false);
        return;
      }

      // Simple visibility check - show after minimal scroll on mobile
      const scrollThreshold = 20; // Very low threshold for immediate visibility
      const shouldShow = window.scrollY > scrollThreshold;
      
      setIsVisible(shouldShow);
    };

    // Initial check
    checkVisibility();

    // Set up listeners
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Check on route/step changes
    const observer = new MutationObserver(checkVisibility);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      observer.disconnect();
    };
  }, [currentStep, location.pathname, deviceType]);

  const scrollToHeroRegistration = () => {
    const heroRegistration = document.querySelector('[data-hero-registration]') || 
                             document.querySelector('input[type="email"]') ||
                             document.getElementById('register');
    
    if (heroRegistration) {
      heroRegistration.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      setTimeout(() => {
        const emailInput = heroRegistration.querySelector?.('input[type="email"]') as HTMLInputElement || 
                          heroRegistration as HTMLInputElement;
        if (emailInput && emailInput.focus) {
          emailInput.focus();
        }
      }, 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ensure only one instance renders
  if (!mounted || !isVisible || activeInstance !== instanceId) return null;

  // Adaptive positioning based on device
  const getAdaptiveStyles = () => {
    const screenWidth = window.innerWidth;
    const baseBottom = 20; // Base bottom spacing
    
    // Device-specific adjustments
    let deviceOffset = 0;
    if (deviceType === 'ios') {
      // iOS has bottom safe area for home indicator
      deviceOffset = 20;
    } else if (deviceType === 'android') {
      // Android might have navigation bar
      deviceOffset = 10;
    }
    
    if (screenWidth <= 480) {
      return {
        bottom: `${baseBottom + deviceOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        width: '90%',
        maxWidth: '350px'
      };
    } else if (screenWidth <= 768) {
      return {
        bottom: `${baseBottom + 20 + deviceOffset}px`, // Reduced from 40 to 20
        right: '20px',
        transform: 'none',
        left: 'auto',
        width: 'auto'
      };
    } else {
      return {
        bottom: `${baseBottom + 30 + deviceOffset}px`, // Reduced from 60 to 30
        right: '40px',
        transform: 'none',
        left: 'auto',
        width: 'auto'
      };
    }
  };

  const responsiveStyles = getAdaptiveStyles();
  const screenWidth = window.innerWidth;

  const ctaElement = (
    <div 
      style={{ 
        position: 'fixed', 
        ...responsiveStyles,
        zIndex: 9999,  // High z-index to ensure visibility above all content
        pointerEvents: 'auto',
        transition: 'all 0.3s ease-in-out',
        opacity: 1, // Always fully opaque when rendered
        transform: responsiveStyles.transform || 'none'
      }}
    >
      {/* Semi-transparent backdrop for better visibility */}
      <div style={{
        position: 'absolute',
        inset: '-8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '9999px',
        zIndex: -1
      }} />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: screenWidth <= 480 ? 'column' : 'row', 
        gap: screenWidth <= 480 ? '12px' : '8px', // Increased mobile gap from 6px to 12px
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '8px' // Add padding to prevent edge overlap
      }}>
        {/* Close button for better UX */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Primary CTA - Cat Parent Priority */}
        <button
          onClick={scrollToHeroRegistration}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            padding: screenWidth <= 480 ? '14px 20px' : '10px 14px', // Increased mobile padding for better separation
            borderRadius: '9999px',
            fontSize: screenWidth <= 480 ? '15px' : '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px -1px rgba(34, 197, 94, 0.4)',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            minWidth: screenWidth <= 480 ? '180px' : 'auto',
            textAlign: 'center',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#16a34a';
            target.style.transform = 'scale(1.05)';
            target.style.boxShadow = '0 6px 16px -1px rgba(34, 197, 94, 0.5)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#22c55e';
            target.style.transform = 'scale(1)';
            target.style.boxShadow = '0 4px 12px -1px rgba(34, 197, 94, 0.4)';
          }}
        >
          😻 {screenWidth <= 480 ? 'Find Perfect Catteries!' : 'Find My Perfect Cattery!'}
          {screenWidth <= 480 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#f59e0b',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '9999px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              PRIORITY
            </div>
          )}
        </button>
        
        {/* Secondary CTA - Cattery Owner (Still Welcome) */}
        <button
          onClick={() => setCurrentStep('registration')}
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            color: '#e0e7ff',
            border: '1px solid rgba(99, 102, 241, 0.6)',
            padding: screenWidth <= 480 ? '12px 18px' : '8px 12px', // Increased mobile padding to match spacing
            borderRadius: '9999px',
            fontSize: screenWidth <= 480 ? '13px' : '11px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            minWidth: screenWidth <= 480 ? '160px' : 'auto',
            textAlign: 'center',
            opacity: 0.9,
            marginTop: screenWidth <= 480 ? '4px' : '0' // Extra margin for mobile separation
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#6366f1';
            target.style.transform = 'scale(1.05)';
            target.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'rgba(99, 102, 241, 0.7)';
            target.style.transform = 'scale(1)';
            target.style.opacity = '0.9';
          }}
        >
          🏢 {screenWidth <= 480 ? 'Cattery Partner' : 'Cattery Owner'}
        </button>
      </div>
    </div>
  );

  return createPortal(ctaElement, document.body);
});

MobileStickyCTAEnhanced.displayName = 'MobileStickyCTAEnhanced';

export default MobileStickyCTAEnhanced;