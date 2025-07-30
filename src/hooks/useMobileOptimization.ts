import { useEffect, useState, useCallback } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isBot: boolean;
  isSlowDevice: boolean;
  connectionType: string;
  deviceMemory?: number;
  userAgent: string;
}

interface MobileOptimizationOptions {
  enablePrefetch?: boolean;
  enableLazyLoading?: boolean;
  enableReducedMotion?: boolean;
}

interface MobileOptimizationResult {
  deviceInfo: DeviceInfo;
  shouldReduceMotion: boolean;
  shouldUseLowQualityImages: boolean;
  shouldLazyLoad: boolean;
  imageFormat: 'webp' | 'jpeg';
  chunkSize: number;
  shouldPrefetch: boolean;
  optimizeImage: (src: string, width?: number) => string;
  preloadCriticalAssets: () => void;
}

// Inline device detection to replace deleted service
const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*Tablet)|Kindle|PlayBook|Silk/i.test(userAgent);
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  // Connection detection
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';
  
  // Device memory detection
  const deviceMemory = (navigator as any).deviceMemory;
  
  // Detect slow devices based on various heuristics
  const isSlowDevice = deviceMemory ? deviceMemory <= 4 : 
    /Android\s[1-4]|iPhone\sOS\s[1-9]_|Windows\sPhone/i.test(userAgent);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isBot,
    isSlowDevice,
    connectionType,
    deviceMemory,
    userAgent
  };
};

const shouldReduceMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const shouldUseLowQualityImages = (): boolean => {
  const connection = (navigator as any).connection;
  return connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);
};

const shouldLazyLoadHeavyComponents = (): boolean => {
  const connection = (navigator as any).connection;
  const deviceMemory = (navigator as any).deviceMemory;
  return deviceMemory ? deviceMemory <= 4 : ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
};

const getOptimalImageFormat = (): 'webp' | 'jpeg' => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpeg';
};

const getRecommendedChunkSize = (): number => {
  const connection = (navigator as any).connection;
  const deviceMemory = (navigator as any).deviceMemory;
  
  if (deviceMemory && deviceMemory <= 2) return 50000; // 50KB chunks for low-memory devices
  if (['slow-2g', '2g'].includes(connection?.effectiveType)) return 30000; // 30KB for slow connections
  if (['3g'].includes(connection?.effectiveType)) return 100000; // 100KB for 3G
  return 200000; // 200KB for fast connections
};

const shouldPrefetch = (): boolean => {
  const connection = (navigator as any).connection;
  return !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType);
};

export function useMobileOptimization(
  options: MobileOptimizationOptions = {}
): MobileOptimizationResult {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    // Update device info on orientation change or resize
    const handleChange = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleChange);
    window.addEventListener('orientationchange', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
      window.removeEventListener('orientationchange', handleChange);
    };
  }, []);

  const shouldReduceMotionValue = options.enableReducedMotion !== false && shouldReduceMotion();
  const shouldUseLowQualityImagesValue = shouldUseLowQualityImages();
  const shouldLazyLoadValue = options.enableLazyLoading !== false && shouldLazyLoadHeavyComponents();
  const imageFormat = getOptimalImageFormat();
  const chunkSize = getRecommendedChunkSize();
  const shouldPrefetchValue = options.enablePrefetch !== false && shouldPrefetch();

  const optimizeImage = useCallback((src: string, width?: number): string => {
    // For demo purposes, just return the original src
    // In production, you'd integrate with an image optimization service like Cloudinary, Vercel Image, etc.
    return src;
  }, []);

  const preloadCriticalAssets = useCallback(() => {
    if (!shouldPrefetchValue || deviceInfo.isBot) return;

    // Preload critical fonts for mobile
    if (deviceInfo.isMobile) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = '/fonts/inter-var.woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }

    // Hero image preload removed - image doesn't exist
  }, [shouldPrefetchValue, deviceInfo]);

  return {
    deviceInfo,
    shouldReduceMotion: shouldReduceMotionValue,
    shouldUseLowQualityImages: shouldUseLowQualityImagesValue,
    shouldLazyLoad: shouldLazyLoadValue,
    imageFormat,
    chunkSize,
    shouldPrefetch: shouldPrefetchValue,
    optimizeImage,
    preloadCriticalAssets
  };
}