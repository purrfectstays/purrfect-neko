import React from 'react';
import { useApp } from '../context/AppContext';
import { Github } from 'lucide-react';

const Header: React.FC = () => {
  const { setCurrentStep } = useApp();

  const handleExploreClick = () => {
    setCurrentStep('explore-catteries');
  };

  const handleTestingClick = () => {
    setCurrentStep('testing' as any);
  };

  const handleGitHubClick = () => {
    setCurrentStep('github');
  };

  return (
    <header className="bg-zinc-900/95 backdrop-blur-sm border-b border-indigo-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50 p-1 shadow-lg">
              <img 
                src="https://i.ibb.co/Qp1NKwY/Purrfect-Stays.png" 
                alt="Purrfect Stays - Three cats with a cozy house representing premium cattery services" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to a cat emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-logo')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-logo w-full h-full flex items-center justify-center text-amber-800 text-xl font-bold rounded-lg bg-amber-100';
                    fallback.textContent = '🏠🐱';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sacramento text-3xl text-white leading-tight text-shadow-custom">Purrfect Stays</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* GitHub Integration Button */}
            <button
              onClick={handleGitHubClick}
              className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-manrope font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Integration</span>
            </button>
            
            {/* Testing Dashboard Button - Development Only */}
            {import.meta.env.DEV && (
              <button
                onClick={handleTestingClick}
                className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-manrope font-semibold text-sm hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <span>🧪 Testing Dashboard</span>
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