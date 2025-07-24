import React, { useEffect, useState } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import LoadingSpinner from './LoadingSpinner';

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Lazy load versions for optimal performance
const UltraLightMobileLanding = React.lazy(() => import('./UltraLightMobileLanding'));
const LandingPage = React.lazy(() => import('./LandingPage'));

/**
 * Smart Landing Page Router
 * Routes users to optimal experience based on device and connection
 */
const SmartLandingRouter: React.FC = () => {
  const { deviceInfo, shouldUseLowQualityImages, shouldLazyLoad } = useMobileOptimization();
  const [selectedVersion, setSelectedVersion] = useState<string>('loading');

  useEffect(() => {
    // Device and connection analysis
    const isMobile = deviceInfo.isMobile;
    const isSlowDevice = deviceInfo.isSlowDevice;
    const hasSlowConnection = shouldUseLowQualityImages; // Proxy for slow connection
    
    // Performance-first routing logic
    if (isMobile && (isSlowDevice || hasSlowConnection)) {
      // Ultra-light for slow mobile devices
      setSelectedVersion('ultra-light');
      
      // Analytics tracking for optimization (safe defer)
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'landing_version', {
            version: 'ultra-light',
            device_type: 'mobile-slow'
          });
        }
      }, 2000);
    } else if (isMobile) {
      // Check screen size for mobile optimization
      if (window.innerWidth < 430) {
        setSelectedVersion('ultra-light'); // Small phones get ultra-light
      } else {
        setSelectedVersion('standard'); // Larger mobile devices get standard
      }
      
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'landing_version', {
            version: window.innerWidth < 430 ? 'ultra-light' : 'standard',
            device_type: 'mobile'
          });
        }
      }, 2000);
    } else {
      // Desktop gets full experience
      setSelectedVersion('standard');
      
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'landing_version', {
            version: 'standard',
            device_type: 'desktop'
          });
        }
      }, 2000);
    }
  }, [deviceInfo, shouldUseLowQualityImages, shouldLazyLoad]);

  // Loading state
  if (selectedVersion === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Render appropriate version
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      {selectedVersion === 'ultra-light' ? (
        <UltraLightMobileLanding />
      ) : (
        <LandingPage />
      )}
    </React.Suspense>
  );
};

export default SmartLandingRouter;