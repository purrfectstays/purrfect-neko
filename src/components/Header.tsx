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
    <header className={`relative z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo/Brand */}
          {showLogo && (
            <Link to="/" className="group">
              <Logo size="sm" className="group-hover:opacity-80 transition-opacity" />
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