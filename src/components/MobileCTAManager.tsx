import React, { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

// Global singleton to ensure only one CTA manager exists
let activeCTAManager: string | null = null;

interface CTAButton {
  id: string;
  text: string;
  icon: string;
  action: () => void;
  priority: 'primary' | 'secondary';
  badge?: string;
  minWidth?: string;
}

/**
 * Centralized Mobile CTA Manager
 * - Single layer system prevents overlap
 * - Coordinates all mobile CTAs
 * - Device-specific positioning
 * - Smart visibility management
 * - Designed to coexist with Truffle chatbot (ChatbotSupport.tsx)
 */
const MobileCTAManager: React.FC = memo(() => {
  const instanceId = React.useRef(`cta-manager-${Date.now()}-${Math.random()}`).current;
  const { setCurrentStep, currentStep } = useApp();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android' | 'mobile'>('mobile');

  // Singleton pattern to ensure only one manager exists
  useEffect(() => {
    if (!activeCTAManager) {
      activeCTAManager = instanceId;
    } else if (activeCTAManager !== instanceId) {
      return; // Another manager is active
    }
    
    setMounted(true);

    return () => {
      if (activeCTAManager === instanceId) {
        activeCTAManager = null;
      }
    };
  }, [instanceId]);

  // Device detection
  useEffect(() => {
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
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Visibility management
  useEffect(() => {
    const checkVisibility = () => {
      // Hide on desktop
      if (deviceType === 'desktop' || window.innerWidth >= 1024) {
        setIsVisible(false);
        return;
      }

      // Hide during specific steps
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

      // Show after minimal scroll
      const scrollThreshold = 20;
      const shouldShow = window.scrollY > scrollThreshold;
      setIsVisible(shouldShow);
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [currentStep, location.pathname, deviceType]);

  // Scroll to hero registration
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

  // CTA button definitions
  const ctaButtons: CTAButton[] = [
    {
      id: 'cat-parent',
      text: window.innerWidth <= 480 ? 'Find Perfect Catteries!' : 'Find My Perfect Cattery!',
      icon: '😻',
      action: scrollToHeroRegistration,
      priority: 'primary',
      badge: window.innerWidth <= 480 ? 'PRIORITY' : undefined,
      minWidth: window.innerWidth <= 480 ? '200px' : 'auto'
    },
    {
      id: 'cattery-owner',
      text: window.innerWidth <= 480 ? 'Cattery Partner' : 'Cattery Owner',
      icon: '🏢',
      action: () => setCurrentStep('registration'),
      priority: 'secondary',
      minWidth: window.innerWidth <= 480 ? '180px' : 'auto'
    }
  ];

  // Calculate positioning to coexist with chatbot (Truffle)
  const getPositioning = () => {
    const screenWidth = window.innerWidth;
    const baseBottom = 20;
    
    // Device-specific adjustments
    let deviceOffset = 0;
    if (deviceType === 'ios') {
      deviceOffset = 20; // iOS home indicator
    } else if (deviceType === 'android') {
      deviceOffset = 10; // Android navigation bar  
    }

    // Chatbot coordination - Truffle is at z-index 50, bottom-20 (80px), right-6 (24px)
    // We need to leave space for the chatbot button
    if (screenWidth <= 480) {
      // Mobile: Center CTAs, chatbot stays in corner
      return {
        position: 'fixed' as const,
        bottom: `${baseBottom + deviceOffset}px`,
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        zIndex: 9999, // Below chatbot (z-50 = 50, but above all other content)
        pointerEvents: 'auto' as const,
        width: '90%',
        maxWidth: '360px' // Slightly smaller to not interfere with chatbot
      };
    } else {
      // Desktop/Tablet: Position CTAs to left of chatbot area
      return {
        position: 'fixed' as const,
        bottom: `${baseBottom + 40 + deviceOffset}px`, // Higher up to avoid chatbot
        right: '140px', // Far enough left of chatbot (chatbot at right-6 = 24px + button width ~100px)
        left: 'auto',
        transform: 'none',
        zIndex: 9999, // Below chatbot but above content
        pointerEvents: 'auto' as const,
        width: 'auto',
        maxWidth: 'none'
      };
    }
  };

  // Render button with proper styling
  const renderButton = (button: CTAButton, index: number) => {
    const isPrimary = button.priority === 'primary';
    const screenWidth = window.innerWidth;
    
    const buttonStyle = {
      backgroundColor: isPrimary ? '#22c55e' : 'rgba(99, 102, 241, 0.8)',
      color: isPrimary ? 'white' : '#e0e7ff',
      border: isPrimary ? 'none' : '1px solid rgba(99, 102, 241, 0.6)',
      padding: screenWidth <= 480 ? '14px 20px' : '10px 14px',
      borderRadius: '9999px',
      fontSize: screenWidth <= 480 ? (isPrimary ? '15px' : '13px') : '13px',
      fontWeight: isPrimary ? 'bold' : '500',
      cursor: 'pointer',
      boxShadow: isPrimary ? '0 4px 12px -1px rgba(34, 197, 94, 0.4)' : 'none',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.3s ease',
      minWidth: button.minWidth || 'auto',
      textAlign: 'center' as const,
      position: 'relative' as const,
      opacity: isPrimary ? 1 : 0.9,
      marginTop: !isPrimary && screenWidth <= 480 ? '8px' : '0' // Extra spacing for secondary
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      if (isPrimary) {
        target.style.backgroundColor = '#16a34a';
        target.style.transform = 'scale(1.05)';
        target.style.boxShadow = '0 6px 16px -1px rgba(34, 197, 94, 0.5)';
      } else {
        target.style.backgroundColor = '#6366f1';
        target.style.transform = 'scale(1.05)';
        target.style.opacity = '1';
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      if (isPrimary) {
        target.style.backgroundColor = '#22c55e';
        target.style.transform = 'scale(1)';
        target.style.boxShadow = '0 4px 12px -1px rgba(34, 197, 94, 0.4)';
      } else {
        target.style.backgroundColor = 'rgba(99, 102, 241, 0.8)';
        target.style.transform = 'scale(1)';
        target.style.opacity = '0.9';
      }
    };

    return (
      <button
        key={button.id}
        onClick={button.action}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {button.icon} {button.text}
        {button.badge && (
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
            {button.badge}
          </div>
        )}
      </button>
    );
  };

  // Don't render if not mounted, not visible, or not active manager
  if (!mounted || !isVisible || activeCTAManager !== instanceId) return null;

  const positioning = getPositioning();
  const screenWidth = window.innerWidth;

  const ctaElement = (
    <div style={positioning}>
      
      {/* CTA Container with proper spacing */}
      <div style={{
        display: 'flex',
        flexDirection: screenWidth <= 480 ? 'column' : 'row',
        gap: screenWidth <= 480 ? '16px' : '12px', // Increased gap to prevent overlap
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '12px' // Adequate padding to prevent edge overlap
      }}>
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          aria-label="Close CTAs"
        >
          ×
        </button>

        {/* Render all CTA buttons with proper spacing */}
        {ctaButtons.map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );

  return createPortal(ctaElement, document.body);
});

MobileCTAManager.displayName = 'MobileCTAManager';

export default MobileCTAManager;