import React from 'react';
import { Link } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';
import Logo from './Logo';

interface HeaderProps {
  showLogo?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ showLogo = true, className = '' }) => {
  return (
    <header className={`relative z-50 ${className}`} role="banner">
      <div className="container mx-auto px-4">
        <nav 
          className="flex items-center justify-between py-3 sm:py-4"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo/Brand */}
          {showLogo && (
            <Link 
              to="/" 
              className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
              aria-label="Return to homepage - Purrfect Stays"
            >
              <Logo size="sm" className="group-hover:opacity-80 transition-opacity" />
            </Link>
          )}
          
          {/* Currency Selector - Always positioned on the right */}
          <div className={`${showLogo ? '' : 'ml-auto'}`}>
            <CurrencySelector />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;