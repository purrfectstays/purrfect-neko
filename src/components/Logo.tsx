import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'full' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSizes = {
    sm: 'h-12',
    md: 'h-16', 
    lg: 'h-24'
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.onload = () => {
      console.log('Logo image loaded successfully');
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Logo image failed to load');
      setImageError(true);
    };
    img.src = '/logo.png';
  }, []);

  const handleImageError = () => {
    console.error('Logo image failed to load in component');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Logo image loaded in component');
    setImageLoaded(true);
  };

  // Show fallback if image failed to load
  if (imageError) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg flex items-center justify-center`}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-full h-full text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C10.5 2 9.2 2.8 8.5 4C7.8 2.8 6.5 2 5 2C3 2 1.5 3.5 1.5 5.5C1.5 6.5 2 7.4 2.7 8L2 10C2 11.1 2.9 12 4 12H6V14C6 15.1 6.9 16 8 16H16C17.1 16 18 15.1 18 14V12H20C21.1 12 22 11.1 22 10L21.3 8C22 7.4 22.5 6.5 22.5 5.5C22.5 3.5 21 2 19 2C17.5 2 16.2 2.8 15.5 4C14.8 2.8 13.5 2 12 2Z" 
              fill="currentColor"
            />
            <path 
              d="M7 4L9 6L11 4M13 4L15 6L17 4" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            <circle cx="9" cy="8" r="1" fill="white" opacity="0.8"/>
            <circle cx="15" cy="8" r="1" fill="white" opacity="0.8"/>
            <path 
              d="M12 9L12 10L11 11L13 11L12 10Z" 
              fill="white" 
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-sacramento text-2xl text-white leading-tight text-shadow-custom">
            Purrfect Stays
          </span>
        </div>
      </div>
    );
  }

  // Show the logo image
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Purrfect Stays" 
        className={`${variant === 'icon' ? iconSizes[size] : imageSizes[size]} w-auto object-contain`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          maxWidth: 'none',
          display: imageLoaded ? 'block' : 'none'
        }}
      />
      {!imageLoaded && !imageError && (
        <div className={`${imageSizes[size]} w-auto bg-zinc-800 animate-pulse rounded-lg flex items-center justify-center`}>
          <span className="text-zinc-400 text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Logo;