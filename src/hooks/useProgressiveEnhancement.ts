import React, { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  isRetina: boolean;
  supportsWebP: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
}

export const useProgressiveEnhancement = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: true, // Start with mobile-first assumption
    isTablet: false,
    isDesktop: false,
    screenWidth: 375, // Default mobile width
    screenHeight: 667,
    isRetina: false,
    supportsWebP: false,
    connectionType: 'unknown'
  });

  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      // Determine device type
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Check WebP support
      const canvas = document.createElement('canvas');
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

      // Detect connection speed (if available)
      const connection = (navigator as any).connection;
      let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';
      
      if (connection) {
        if (connection.effectiveType === '4g' || connection.downlink > 10) {
          connectionType = 'fast';
        } else if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
          connectionType = 'slow';
        }
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        isRetina: devicePixelRatio > 1,
        supportsWebP,
        connectionType
      });

      // Progressive enhancement after initial mobile render
      if (!isEnhanced && !isMobile) {
        setTimeout(() => setIsEnhanced(true), 100);
      }
    };

    // Initial check
    updateDeviceInfo();

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    
    // Listen for connection changes
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateDeviceInfo);
    }

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateDeviceInfo);
      }
    };
  }, [isEnhanced]);

  // Determine if we should load enhanced features
  const shouldLoadEnhanced = () => {
    return (
      (deviceInfo.isDesktop || deviceInfo.isTablet) &&
      deviceInfo.connectionType !== 'slow' &&
      isEnhanced
    );
  };

  // Get optimal image quality based on device and connection
  const getImageQuality = () => {
    if (deviceInfo.connectionType === 'slow') return 'low';
    if (deviceInfo.isMobile && !deviceInfo.isRetina) return 'medium';
    return 'high';
  };

  // Get appropriate bundle to load
  const getBundlePriority = () => {
    if (deviceInfo.isMobile) return 'mobile';
    if (deviceInfo.isTablet) return 'tablet';
    return 'desktop';
  };

  return {
    deviceInfo,
    isEnhanced,
    shouldLoadEnhanced: shouldLoadEnhanced(),
    imageQuality: getImageQuality(),
    bundlePriority: getBundlePriority()
  };
};

// Hook for conditional component loading
export const useConditionalComponent = <T extends object>(
  MobileComponent: React.ComponentType<T>,
  DesktopComponent: React.ComponentType<T>,
  props: T
): React.ReactElement => {
  const { deviceInfo, shouldLoadEnhanced } = useProgressiveEnhancement();
  
  if (deviceInfo.isMobile || !shouldLoadEnhanced) {
    return React.createElement(MobileComponent, props);
  }
  
  return React.createElement(DesktopComponent, props);
};