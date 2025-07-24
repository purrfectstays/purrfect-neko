import React from 'react';
import { useApp } from '../context/AppContext';

// Tree-shaken icons to reduce bundle size
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const Shield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
  </svg>
);

const Star = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const Clock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

/**
 * Ultra-Light Mobile Landing Page
 * Target: < 50KB bundle, 85-90+ Performance Score
 * Focus: Maximum conversion with minimal friction
 */
const UltraLightMobileLanding: React.FC = () => {
  const { setCurrentStep } = useApp();

  const handleJoinClick = () => {
    setCurrentStep('registration');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Minimal Header */}
      <header className="px-4 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-400">Purrfect Stays</h1>
          <span className="text-xs text-green-400 px-2 py-1 bg-green-900/30 rounded">EARLY ACCESS</span>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <main className="px-4 py-8">
        {/* Value Proposition */}
        <div className="text-center mb-8" style={{contain: 'layout style'}}>
          <h2 className="text-3xl font-bold mb-4 leading-tight" style={{minHeight: '4.5rem'}}>
            Find <span className="text-indigo-400">Premium</span> Cat Care 
            <br />When You Need It
          </h2>
          
          <p className="text-lg text-zinc-300 mb-6">
            Join 1,000+ cat parents building the future of cattery bookings.
            Get exclusive resources + founding member benefits.
          </p>

          {/* Primary CTA */}
          <button
            onClick={handleJoinClick}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Get Free Resource Toolkit + Early Access</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-zinc-400 mt-3">
            ✨ Instant access • No payment required • Join founding community
          </p>
        </div>

        {/* Compact Value Preview */}
        <div className="bg-zinc-800/50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-green-400 mb-4 text-center">🎁 Your Free Welcome Package</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Professional cattery evaluation checklist</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Cat travel preparation guide</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Priority access to platform (Q4 2025)</span>
            </div>
          </div>
        </div>

        {/* Simplified Trust Indicators */}
        <div className="text-center mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="text-lg font-bold text-indigo-400">1,000+</div>
              <div className="text-xs text-zinc-400">Community Members</div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="text-lg font-bold text-purple-400">Q4 2025</div>
              <div className="text-xs text-zinc-400">Beta Launch</div>
            </div>
          </div>
          
          <p className="text-sm text-zinc-400">
            🚀 Building the cattery platform cat parents actually want
          </p>
        </div>

        {/* Secondary CTA */}
        <div className="text-center">
          <button
            onClick={handleJoinClick}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-6 rounded-lg font-medium transition-all border border-zinc-600"
          >
            Join the Founding Community →
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="px-4 py-6 border-t border-zinc-800 text-center">
        <p className="text-xs text-zinc-500">
          Early access platform • Launching Q4 2025 • 
          <a href="/privacy" className="text-indigo-400 hover:underline ml-1">Privacy</a>
        </p>
      </footer>
    </div>
  );
};

export default UltraLightMobileLanding;