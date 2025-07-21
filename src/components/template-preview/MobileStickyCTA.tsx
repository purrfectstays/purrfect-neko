import React, { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';

/**
 * Mobile sticky CTA bar that appears when scrolling down
 * Provides quick access to cattery registration and platform preview
 */
const MobileStickyCTA: React.FC = memo(() => {
  const { setCurrentStep } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToHeroRegistration = () => {
    // Find the hero section registration form for cat parents
    const heroRegistration = document.querySelector('[data-hero-registration]') || 
                             document.querySelector('input[type="email"]') ||
                             document.getElementById('register');
    
    if (heroRegistration) {
      heroRegistration.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Focus on email input after scroll
      setTimeout(() => {
        const emailInput = heroRegistration.querySelector?.('input[type="email"]') as HTMLInputElement || 
                          heroRegistration as HTMLInputElement;
        if (emailInput && emailInput.focus) {
          emailInput.focus();
        }
      }, 500);
    } else {
      // Fallback: scroll to top of page where hero section is
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!mounted || window.innerWidth >= 1024) return null;

  // Responsive positioning based on screen width
  const getResponsiveStyles = () => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
      // Small phones
      return {
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        width: '90%',
        maxWidth: '350px'
      };
    } else if (screenWidth <= 768) {
      // Medium phones/small tablets
      return {
        bottom: '60px',
        right: '120px',
        transform: 'none',
        left: 'auto',
        width: 'auto'
      };
    } else {
      // Large phones/tablets
      return {
        bottom: '80px',
        right: '180px',
        transform: 'none',
        left: 'auto',
        width: 'auto'
      };
    }
  };

  const responsiveStyles = getResponsiveStyles();
  const screenWidth = window.innerWidth;

  const ctaElement = (
    <div 
      style={{ 
        position: 'fixed', 
        ...responsiveStyles,
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: screenWidth <= 480 ? 'column' : 'row', 
        gap: screenWidth <= 480 ? '6px' : '8px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Primary CTA - Register as a PurrParent */}
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
          onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
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
          onMouseEnter={(e) => e.target.style.backgroundColor = '#6366f1'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.8)'}
        >
          Cattery Owner
        </button>
      </div>
    </div>
  );

  return createPortal(ctaElement, document.body);
});

MobileStickyCTA.displayName = 'MobileStickyCTA';

export default MobileStickyCTA;