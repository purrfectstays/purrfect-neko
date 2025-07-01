import React from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { setCurrentStep } = useApp();

  const handleExploreClick = () => {
    setCurrentStep('explore-catteries');
  };

  const handleLaunchTestClick = () => {
    setCurrentStep('launch-test');
  };


  return (
    <header className="bg-zinc-900/95 backdrop-blur-sm border-b border-indigo-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" variant="full" />
          
          <div className="flex items-center space-x-4">
            {/* Launch Test Button - Development/Testing */}
            {import.meta.env.DEV && (
              <button
                onClick={handleLaunchTestClick}
                className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-manrope font-semibold text-sm hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                <span>🚀 Launch Test</span>
              </button>
            )}
            
            {/* Explore Catteries Button */}
            <button
              onClick={handleExploreClick}
              className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-manrope font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <span>🗺️ Explore Catteries</span>
            </button>
            
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-manrope font-semibold animate-pulse-slow shadow-lg">
                🚀 Early Access Waiting List Now Open
              </div>
            </div>
            
            <div className="sm:hidden">
              <button
                onClick={handleExploreClick}
                className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-manrope font-semibold shadow-lg"
              >
                🗺️ Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;