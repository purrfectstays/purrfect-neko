import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PerformanceOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  webpSrc?: string;
  mobileSrc?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const PerformanceOptimizedImage: React.FC<PerformanceOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  webpSrc,
  mobileSrc,
  sizes,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const sourceWebpRef = useRef<HTMLSourceElement>(null);
  const sourceMobileRef = useRef<HTMLSourceElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate placeholder for better CLS
  const placeholder = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width || 400}" height="${height || 300}">
      <rect fill="#f3f4f6" width="100%" height="100%"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
        ${isLoaded ? '' : 'Loading...'}
      </text>
    </svg>`
  )}`;

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return '';
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    
    return [
      `${baseName}-400.${extension} 400w`,
      `${baseName}-800.${extension} 800w`,
      `${baseName}-1200.${extension} 1200w`,
      `${baseName}-1600.${extension} 1600w`
    ].join(', ');
  };

  const shouldLoad = priority || isInView;

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {webpSrc && shouldLoad && (
        <source
          ref={sourceWebpRef}
          srcSet={mobileSrc ? 
            `${mobileSrc} 400w, ${webpSrc} 800w` : 
            generateSrcSet(webpSrc)
          }
          sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
          type="image/webp"
        />
      )}
      
      {/* Mobile-specific source */}
      {mobileSrc && shouldLoad && (
        <source
          ref={sourceMobileRef}
          srcSet={generateSrcSet(mobileSrc)}
          sizes={sizes || "100vw"}
          media="(max-width: 768px)"
        />
      )}
      
      {/* Main image element */}
      <img
        ref={imgRef}
        src={shouldLoad ? src : placeholder}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`
          optimized-image
          ${isLoaded ? 'loaded' : 'loading'}
          ${!shouldLoad ? 'opacity-0' : ''}
          transition-opacity duration-300
          ${className}
        `}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
      />
    </picture>
  );
};

export default PerformanceOptimizedImage;