import { useEffect, useState, useCallback } from 'react';
import { userAgentService, type DeviceInfo } from '../services/userAgentService';

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

export function useMobileOptimization(
  options: MobileOptimizationOptions = {}
): MobileOptimizationResult {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(
    userAgentService.getDeviceInfo()
  );

  useEffect(() => {
    // Update device info on orientation change or resize
    const handleChange = () => {
      setDeviceInfo(userAgentService.getDeviceInfo());
    };

    window.addEventListener('resize', handleChange);
    window.addEventListener('orientationchange', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
      window.removeEventListener('orientationchange', handleChange);
    };
  }, []);

  const shouldReduceMotion = options.enableReducedMotion !== false && 
    userAgentService.shouldReduceMotion();

  const shouldUseLowQualityImages = userAgentService.shouldUseLowQualityImages();
  
  const shouldLazyLoad = options.enableLazyLoading !== false && 
    userAgentService.shouldLazyLoadHeavyComponents();

  const imageFormat = userAgentService.getOptimalImageFormat();
  const chunkSize = userAgentService.getRecommendedChunkSize();
  
  const shouldPrefetch = options.enablePrefetch !== false && 
    userAgentService.shouldPrefetch();

  const optimizeImage = useCallback((src: string, width?: number): string => {
    // For demo purposes, just return the original src
    // In production, you'd integrate with an image optimization service like Cloudinary, Vercel Image, etc.
    return src;
  }, []);

  const preloadCriticalAssets = useCallback(() => {
    if (!shouldPrefetch || deviceInfo.isBot) return;

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
  }, [shouldPrefetch, deviceInfo, optimizeImage]);

  return {
    deviceInfo,
    shouldReduceMotion,
    shouldUseLowQualityImages,
    shouldLazyLoad,
    imageFormat,
    chunkSize,
    shouldPrefetch,
    optimizeImage,
    preloadCriticalAssets
  };
}