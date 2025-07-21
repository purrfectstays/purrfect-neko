import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import InlineRegistrationFormEnhanced from './InlineRegistrationFormEnhanced';
import PerformanceOptimizedImage from '../PerformanceOptimizedImage';

// Animated text with cycling words
const AnimatedPerfect: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['Perfect', 'Premium', 'Trusted', 'Quality', 'Caring', 'Expert'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span 
      className="animated-perfect-css" 
      aria-label="Perfect"
      style={{ minWidth: '120px', display: 'inline-block' }} // Ensure space is reserved
    >
      <span className="animated-text-content">
        {words[currentWordIndex]}
      </span>
    </span>
  );
};

interface HeroSectionProps {
  waitlistStats: {
    totalUsers: number;
    verifiedUsers: number;
    completedQuizzes: number;
  } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ waitlistStats }) => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20 critical-hero">
      {/* Optimized animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse hw-accelerated" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse hw-accelerated" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Social Proof #1 - Real Data */}
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mobile-optimized">
              <Star className="w-4 h-4 text-green-400" aria-hidden="true" />
              <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                {waitlistStats ? 
                  `TRUSTED BY ${waitlistStats.totalUsers}+ CAT PARENTS IN WAITLIST` : 
                  'BUILDING FOUNDING COMMUNITY'
                }
              </span>
            </div>

            {/* Dream Outcome Headline - Cat Parent Focused */}
            <header>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight font-loading">
                Find <AnimatedPerfect /> Cat Care Near You
              </h1>
            </header>

            {/* Pain Point and Solution - Cat Parent Focused */}
            <div className="space-y-4">
              <p className="text-xl lg:text-2xl text-green-400 font-semibold">
                Stop settling for "just okay" catteries • No more last-minute scrambling • Building peace of mind together
              </p>
              <p className="text-lg text-zinc-300-accessible">
                Join our founding community to help shape a platform that will connect you with premium, verified catteries. 
                Together we're building real-time availability, transparent pricing, and trusted reviews.
              </p>
            </div>

            {/* Enhanced Inline Registration Form */}
            <InlineRegistrationFormEnhanced />

            {/* Cat Parent Benefits - Enhanced with better spacing */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mt-0.5 flex-shrink-0" aria-hidden="true">
                  <span className="text-xs text-zinc-900">✓</span>
                </div>
                <span className="text-zinc-300-accessible">
                  <strong className="text-white">100% FREE for cat parents</strong> - Always free to find care
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mt-0.5 flex-shrink-0" aria-hidden="true">
                  <span className="text-xs text-zinc-900">✓</span>
                </div>
                <span className="text-zinc-300-accessible">
                  <strong className="text-white">Instant access</strong> to comprehensive cat travel checklist
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mt-0.5 flex-shrink-0" aria-hidden="true">
                  <span className="text-xs text-zinc-900">✓</span>
                </div>
                <span className="text-zinc-300-accessible">
                  <strong className="text-white">Early access</strong> to Q4 2025 launch with founding member benefits
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <PerformanceOptimizedImage
              src="/landingpageimage4.jpg"
              alt="Individual cat receiving premium care in comfortable cattery environment"
              width={600}
              height={450}
              className="w-full h-[450px] object-cover rounded-2xl shadow-xl prevent-cls"
              priority={true}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Overlay elements with optimized animations */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-fade-in">
              ✅ Verified Premium
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-fade-in mobile-optimized">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                </div>
                <span className="text-sm">
                  {waitlistStats ? `${waitlistStats.totalUsers} cat parents joined` : 'Building founding community'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;