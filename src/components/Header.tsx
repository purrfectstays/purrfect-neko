import React from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { FileText, Shield, Download } from 'lucide-react';


const Header: React.FC = () => {
  const { setCurrentStep, userEmail, isVerified } = useApp();

  const handleExploreClick = () => {
    setCurrentStep('explore-catteries');
  };


  // Check if user has access to resources (either verified or just registered)
  const hasResourceAccess = userEmail && userEmail.length > 0;


  return (
    <header className="bg-zinc-900/95 backdrop-blur-sm border-b border-indigo-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" variant="full" />
          
          <div className="flex items-center space-x-3">
            {/* Resource Access for Registered Users */}
            {hasResourceAccess && (
              <div className="flex items-center space-x-2">
                {/* Travel Checklist Access */}
                <button
                  onClick={() => window.location.href = '/cat-travel-checklist'}
                  className="hidden md:inline-flex items-center space-x-1 bg-indigo-600/80 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  title="Cat Travel Checklist"
                >
                  <FileText className="h-3 w-3" />
                  <span>Checklist</span>
                </button>
                
                {/* Evaluation Guide Access */}
                <button
                  onClick={() => window.location.href = '/cattery-evaluation-guide'}
                  className="hidden md:inline-flex items-center space-x-1 bg-purple-600/80 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  title="Cattery Evaluation Guide"
                >
                  <Shield className="h-3 w-3" />
                  <span>Guide</span>
                </button>
                
                {/* All Resources Access - Mobile/Tablet */}
                <button
                  onClick={() => window.location.href = '/early-access-resources'}
                  className="md:hidden inline-flex items-center space-x-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  title="Your Free Resources"
                >
                  <Download className="h-3 w-3" />
                  <span>Resources</span>
                </button>
              </div>
            )}
            
            
            {/* Cattery Entry Point - Subtle */}
            <button
              onClick={() => {
                const catteryForm = document.querySelector('[data-cattery-registration-form]');
                if (catteryForm) {
                  catteryForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = catteryForm.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="hidden md:inline-flex items-center space-x-1 text-zinc-300 hover:text-white text-xs font-medium transition-all"
              title="For Cattery Owners"
            >
              <span>📍 List Your Cattery</span>
            </button>

            {/* Explore Platform Preview */}
            <button
              onClick={handleExploreClick}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg font-semibold text-xs hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <span className="hidden sm:inline">🗺️ Platform Preview</span>
              <span className="sm:hidden">🗺️ Preview</span>
            </button>
            
            {/* User Status Indicator */}
            {hasResourceAccess && (
              <div className="hidden lg:flex items-center space-x-1 bg-zinc-800/50 rounded-lg px-2 py-1 border border-zinc-700">
                <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-xs text-zinc-300 font-medium">
                  {isVerified ? 'Verified' : 'Member'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;