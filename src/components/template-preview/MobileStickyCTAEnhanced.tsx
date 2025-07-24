import React, { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';

/**
 * Enhanced Mobile sticky CTA bar with context awareness
 * - Hides during quiz to prevent overlap
 * - Smart positioning to avoid accidental clicks
 * - Respects user interaction zones
 */
const MobileStickyCTAEnhanced: React.FC = memo(() => {
  const { setCurrentStep, currentStep } = useApp();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteractiveContent, setHasInteractiveContent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkVisibility = () => {
      // Hide on desktop
      if (window.innerWidth >= 1024) {
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

      // Check for interactive elements near bottom
      const bottomElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight - 100
      );
      
      const hasBottomInteractive = bottomElements.some(el => {
        const tagName = el.tagName.toLowerCase();
        return ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
               el.getAttribute('role') === 'button' ||
               el.onclick !== null;
      });

      setHasInteractiveContent(hasBottomInteractive);

      // Show only when scrolled down and no interactive content at bottom
      const scrollThreshold = 200;
      const shouldShow = window.scrollY > scrollThreshold && !hasBottomInteractive;
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
  }, [currentStep, location.pathname]);

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

  if (!mounted || !isVisible) return null;

  // Adaptive positioning based on content
  const getAdaptiveStyles = () => {
    const screenWidth = window.innerWidth;
    const baseBottom = hasInteractiveContent ? 120 : 20; // Move up if interactive content below
    
    if (screenWidth <= 480) {
      return {
        bottom: `${baseBottom}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        width: '90%',
        maxWidth: '350px'
      };
    } else if (screenWidth <= 768) {
      return {
        bottom: `${baseBottom + 40}px`,
        right: '20px',
        transform: 'none',
        left: 'auto',
        width: 'auto'
      };
    } else {
      return {
        bottom: `${baseBottom + 60}px`,
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
        zIndex: 999,  // Reduced from 999999 to be below modals but above content
        pointerEvents: 'auto',
        transition: 'all 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? responsiveStyles.transform 
          : `${responsiveStyles.transform} translateY(20px)`
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
        gap: screenWidth <= 480 ? '6px' : '8px',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
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

        {/* Primary CTA */}
        <button
          onClick={scrollToHeroRegistration}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            padding: screenWidth <= 480 ? '10px 16px' : '8px 12px',
            borderRadius: '9999px',
            fontSize: screenWidth <= 480 ? '14px' : '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            minWidth: screenWidth <= 480 ? '160px' : 'auto',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#16a34a';
            target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#22c55e';
            target.style.transform = 'scale(1)';
          }}
        >
          {screenWidth <= 480 ? 'Register as PurrParent' : 'Register as a PurrParent'}
        </button>
        
        <button
          onClick={() => setCurrentStep('registration')}
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            color: '#e0e7ff',
            border: '1px solid rgba(99, 102, 241, 0.7)',
            padding: screenWidth <= 480 ? '10px 16px' : '8px 12px',
            borderRadius: '9999px',
            fontSize: screenWidth <= 480 ? '14px' : '12px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            minWidth: screenWidth <= 480 ? '160px' : 'auto',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#6366f1';
            target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'rgba(99, 102, 241, 0.8)';
            target.style.transform = 'scale(1)';
          }}
        >
          Cattery Owner
        </button>
      </div>
    </div>
  );

  return createPortal(ctaElement, document.body);
});

MobileStickyCTAEnhanced.displayName = 'MobileStickyCTAEnhanced';

export default MobileStickyCTAEnhanced;