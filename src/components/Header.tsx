import React from 'react';
import { Link } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';

interface HeaderProps {
  showLogo?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ showLogo = true, className = '' }) => {
  return (
    <header className={`relative z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo/Brand */}
          {showLogo && (
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl">🐱</span>
              <span className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                <span className="hidden sm:inline">Purrfect Stays</span>
                <span className="sm:hidden">Purrfect</span>
              </span>
            </Link>
          )}
          
          {/* Currency Selector - Always positioned on the right */}
          <div className={`${showLogo ? '' : 'ml-auto'}`}>
            <CurrencySelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;