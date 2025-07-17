import React, { useState, useEffect, useRef } from 'react';

interface MobileFirstImageProps {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
}

const MobileFirstImage: React.FC<MobileFirstImageProps> = ({
  mobileSrc,
  desktopSrc,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 1200px',
  width,
  height,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Detect desktop viewport
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Generate WebP sources with fallback
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) {
      return {
        webp: '',
        original: ''
      };
    }
    const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return {
      webp: webpSrc,
      original: baseSrc
    };
  };

  const mobileSources = generateSrcSet(mobileSrc);
  const desktopSources = generateSrcSet(desktopSrc);

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg"
          style={{ 
            paddingBottom: height && width ? `${(height / width) * 100}%` : '56.25%' 
          }}
        />
      )}
      
      {/* Progressive image loading */}
      {isInView && (
        <picture>
          {/* Desktop WebP */}
          <source
            media="(min-width: 768px)"
            srcSet={desktopSources.webp}
            type="image/webp"
          />
          
          {/* Mobile WebP */}
          <source
            media="(max-width: 767px)"
            srcSet={mobileSources.webp}
            type="image/webp"
          />
          
          {/* Desktop fallback */}
          <source
            media="(min-width: 768px)"
            srcSet={desktopSources.original}
          />
          
          {/* Mobile fallback (default) */}
          <img
            src={mobileSources.original}
            alt={alt}
            className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={width}
            height={height}
            sizes={sizes}
            onLoad={handleLoad}
          />
        </picture>
      )}
    </div>
  );
};

export default MobileFirstImage;