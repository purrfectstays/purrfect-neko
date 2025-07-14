import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    // Fallback to Intersection Observer
    const imageElement = document.querySelector(`img[data-src="${src}"]`);
    if (!imageElement) return;

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

    observer.observe(imageElement);

    return () => {
      if (imageElement) observer.unobserve(imageElement);
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder/skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg" />
      )}
      
      <img
        src={isInView ? src : undefined}
        data-src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;