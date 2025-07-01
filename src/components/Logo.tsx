import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
}) => {

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const logoSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  // Use the new logo image file
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Purrfect Stays Logo" 
        className={`${logoSizes[size]} object-contain`}
      />
      <div className="flex flex-col">
        <span className={`font-bold ${textSizes[size]} text-white leading-tight`}>
          Purrfect Stays
        </span>
      </div>
    </div>
  );
};

export default Logo;