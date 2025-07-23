import React, { useEffect, ReactNode } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

interface MobileOptimizationProviderProps {
  children: ReactNode;
  enablePrefetch?: boolean;
  enableLazyLoading?: boolean;
  enableReducedMotion?: boolean;
}

export default function MobileOptimizationProvider({
  children,
  enablePrefetch = true,
  enableLazyLoading = true,
  enableReducedMotion = true,
}: MobileOptimizationProviderProps) {
  const { 
    deviceInfo, 
    shouldReduceMotion,
    shouldPrefetch,
    chunkSize
  } = useMobileOptimization({
    enablePrefetch,
    enableLazyLoading,
    enableReducedMotion,
  });

  useEffect(() => {
    // Configure webpack chunk loading based on device
    if (window.__webpack_chunk_load_timeout__) {
      // Increase timeout for slow connections
      if (['slow-2g', '2g'].includes(deviceInfo.connectionType)) {
        window.__webpack_chunk_load_timeout__ = 60000; // 60 seconds
      } else if (deviceInfo.connectionType === '3g') {
        window.__webpack_chunk_load_timeout__ = 30000; // 30 seconds
      } else {
        window.__webpack_chunk_load_timeout__ = 15000; // 15 seconds (default)
      }
    }

    // Configure resource hints based on device
    if (shouldPrefetch && !deviceInfo.isBot) {
      // Prefetch next likely navigation
      const prefetchLinks = [
        '/quiz',
        '/success',
        '/join',
      ];

      prefetchLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    }

    // Set viewport meta tag based on device
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      if (deviceInfo.isIOS) {
        // iOS-specific viewport settings
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      } else {
        // Standard viewport settings
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, viewport-fit=cover'
        );
      }
    }
  }, [deviceInfo, shouldPrefetch]);

  // Provide optimization context to children
  return (
    <div 
      data-device-type={deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}
      data-connection={deviceInfo.connectionType}
      data-reduced-motion={shouldReduceMotion}
    >
      {children}
    </div>
  );
}

// Helper component for conditionally rendering based on device
export function MobileOnly({ children }: { children: ReactNode }) {
  const { deviceInfo } = useMobileOptimization();
  return deviceInfo.isMobile ? <>{children}</> : null;
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  const { deviceInfo } = useMobileOptimization();
  return deviceInfo.isDesktop ? <>{children}</> : null;
}

export function FastConnectionOnly({ children }: { children: ReactNode }) {
  const { deviceInfo } = useMobileOptimization();
  return ['4g', 'unknown'].includes(deviceInfo.connectionType) ? <>{children}</> : null;
}

export function SlowConnectionFallback({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback: ReactNode;
}) {
  const { deviceInfo } = useMobileOptimization();
  const isSlowConnection = ['slow-2g', '2g', '3g'].includes(deviceInfo.connectionType);
  return isSlowConnection ? <>{fallback}</> : <>{children}</>;
}