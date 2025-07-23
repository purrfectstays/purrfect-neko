import React, { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { cn } from '../lib/utils';

interface MobileOptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  quality?: number;
}

export default function MobileOptimizedImage({
  src,
  alt,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  objectFit = 'cover',
  sizes,
  quality,
  className,
  width,
  height,
  ...props
}: MobileOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { 
    deviceInfo, 
    shouldUseLowQualityImages, 
    optimizeImage, 
    imageFormat 
  } = useMobileOptimization();

  // Generate optimized src
  const optimizedSrc = optimizeImage(src, typeof width === 'number' ? width : undefined);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const currentRef = imgRef.current;
    if (!currentRef) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        // Load images 50px before they enter viewport on mobile
        rootMargin: deviceInfo.isMobile ? '50px' : '100px',
        threshold: 0.01,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [priority, deviceInfo.isMobile]);

  // Preload priority images
  useEffect(() => {
    if (priority && !isLoaded) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      if (imageFormat === 'webp') {
        link.type = 'image/webp';
      }
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, optimizedSrc, imageFormat, isLoaded]);

  // Generate sizes attribute based on device
  const generateSizes = () => {
    if (sizes) return sizes;
    
    if (deviceInfo.isMobile) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 80vw, 640px';
    } else if (deviceInfo.isTablet) {
      return '(max-width: 1024px) 80vw, 768px';
    } else {
      return '(max-width: 1280px) 80vw, 1200px';
    }
  };

  // Placeholder styles
  const placeholderStyles: React.CSSProperties = {
    filter: placeholder === 'blur' && !isLoaded ? 'blur(20px)' : undefined,
    transform: placeholder === 'blur' && !isLoaded ? 'scale(1.1)' : undefined,
    opacity: !isLoaded && !blurDataURL ? 0.7 : 1,
    transition: 'filter 0.3s, transform 0.3s, opacity 0.3s',
  };

  // Loading skeleton
  const showSkeleton = !isLoaded && !blurDataURL && placeholder !== 'empty';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width || 'auto',
        height: height || 'auto',
      }}
    >
      {/* Loading skeleton */}
      {showSkeleton && (
        <div
          className={cn(
            'absolute inset-0 lazy-load-placeholder',
            deviceInfo.isSlowDevice && 'animation-none bg-zinc-800'
          )}
        />
      )}

      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={(isInView || priority) ? optimizedSrc : undefined}
        alt={alt}
        width={width}
        height={height}
        sizes={generateSizes()}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          console.warn('Failed to load image:', optimizedSrc);
          setIsLoaded(true); // Show placeholder instead of infinite loading
        }}
        className={cn(
          'w-full h-full',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100 transition-opacity duration-300'
        )}
        style={placeholderStyles}
        {...props}
      />

      {/* Low bandwidth indicator */}
      {shouldUseLowQualityImages && isLoaded && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Low bandwidth mode
        </div>
      )}
    </div>
  );
}