import React, { useState, useEffect, useRef } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  aspectRatio,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { shouldUseLowQualityImages, imageFormat } = useMobileOptimization();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate optimized image paths
  const getOptimizedSrc = (originalSrc: string, suffix = '') => {
    const filename = originalSrc.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    const extension = imageFormat === 'webp' ? 'webp' : 'jpg';
    return `/optimized/${filename}${suffix}.${extension}`;
  };

  // Generate responsive sources
  const responsiveSources = [
    { media: '(max-width: 480px)', src: getOptimizedSrc(src, '-xs') },
    { media: '(max-width: 768px)', src: getOptimizedSrc(src, '-sm') },
    { media: '(max-width: 1024px)', src: getOptimizedSrc(src, '-md') },
    { media: '(max-width: 1280px)', src: getOptimizedSrc(src, '-lg') },
    { media: '(min-width: 1281px)', src: getOptimizedSrc(src, '-xl') }
  ];

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error - fallback to original
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Get aspect ratio styles
  const getAspectRatioStyles = () => {
    if (!aspectRatio) return {};
    
    const ratios: Record<string, string> = {
      'square': '1/1',
      '16:9': '16/9',
      '4:3': '4/3',
      '3:2': '3/2'
    };
    
    return {
      aspectRatio: ratios[aspectRatio] || aspectRatio
    };
  };

  const finalSrc = hasError ? src : getOptimizedSrc(src);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={getAspectRatioStyles()}
    >
      {/* Blur placeholder */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
      )}

      {/* Optimized image with WebP support and responsive sources */}
      {isInView && (
        <picture>
          {/* WebP sources for modern browsers */}
          {imageFormat === 'webp' && !hasError && responsiveSources.map((source, index) => (
            <source 
              key={`webp-${index}`}
              media={source.media}
              srcSet={source.src}
              type="image/webp"
            />
          ))}
          
          {/* JPEG fallbacks */}
          {!hasError && responsiveSources.map((source, index) => (
            <source 
              key={`jpeg-${index}`}
              media={source.media}
              srcSet={source.src.replace('.webp', '.jpg')}
              type="image/jpeg"
            />
          ))}
          
          {/* Final fallback to original */}
          <img
            src={finalSrc}
            alt={alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`
              w-full h-full object-cover transition-opacity duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${shouldUseLowQualityImages ? 'image-rendering-pixelated' : ''}
            `}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500">
          <span className="text-sm">Image failed to load</span>
        </div>
      )}

      {/* Loading indicator for priority images */}
      {priority && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;