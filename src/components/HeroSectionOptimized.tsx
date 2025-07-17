import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Star, Users, Clock, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PerformanceOptimizedImage from './PerformanceOptimizedImage';

// Optimized rotating words with reduced bundle size
const rotatingWords = ['Perfect', 'Trusted', 'Ideal', 'Safe', 'Caring'];

// Custom SVG icons for better performance
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const HeroSectionOptimized: React.FC = () => {
  const { setCurrentStep } = useApp();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoized word rotation effect
  const currentWord = useMemo(() => rotatingWords[currentWordIndex], [currentWordIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Optimized CTA handler with performance tracking
  const handleCTAClick = useCallback(() => {
    // Track performance
    const startTime = performance.now();
    
    window.location.href = '/join';
    
    // Track CTA performance
    const endTime = performance.now();
    if ('gtag' in window) {
      (window as any).gtag('event', 'timing_complete', {
        name: 'cta_click_response',
        value: Math.round(endTime - startTime)
      });
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden critical-hero">
      {/* Optimized background gradient with CSS variables */}
      <div className="absolute inset-0 gradient-performance" />
      
      {/* Reduced complexity animated background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="main-content">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section - Optimized for accessibility */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Main headline with enhanced accessibility */}
            <header className="space-y-4">
              <h1 className="font-manrope font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight">
                The Future of{' '}
                <span 
                  className={`transition-all duration-300 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-bold ${
                    isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                  }`}
                  aria-label={`${currentWord} cat care`}
                >
                  {currentWord}
                </span>{' '}
                Cat Care
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300-accessible font-manrope leading-relaxed">
                The revolutionary platform connecting cat parents with premium catteries. 
                <strong className="text-white"> Launching Q4 2025.</strong>
              </p>
            </header>

            {/* Enhanced value propositions with better contrast */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                  <h3 className="font-manrope font-bold text-indigo-400">For Cat Parents</h3>
                </div>
                <p className="font-manrope text-zinc-300-accessible text-sm">
                  Find trusted catteries • Compare prices • Book instantly • Peace of mind guaranteed
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-400" aria-hidden="true" />
                  <h3 className="font-manrope font-bold text-purple-400">For Cattery Owners</h3>
                </div>
                <p className="font-manrope text-zinc-300-accessible text-sm">
                  Help shape our platform • Early access benefits • Premium listing tools • Automated bookings
                </p>
              </div>
            </div>

            {/* Enhanced Stats with improved accessibility */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 py-8">
              <div className="flex items-center space-x-2 text-zinc-300-accessible">
                <UsersIcon aria-hidden="true" />
                <span className="font-manrope">Building our early access community</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300-accessible">
                <StarIcon aria-hidden="true" />
                <span className="font-manrope">Backed by industry expertise</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300-accessible">
                <ClockIcon aria-hidden="true" />
                <span className="font-manrope">Beta launching Q4 2025</span>
              </div>
            </div>

            {/* Enhanced CTA with better accessibility */}
            <div className="space-y-6">
              <button
                onClick={handleCTAClick}
                className="group critical-button focus-visible:focus touch-target-optimized"
                aria-describedby="cta-description"
                type="button"
              >
                <span>Join in 60 Seconds</span>
                <ArrowRightIcon aria-hidden="true" />
              </button>
              
              <div className="space-y-2" id="cta-description">
                <p className="text-sm text-zinc-400-accessible font-manrope">
                  🔒 No commitment required • 🎯 Free to join • 💎 Early access benefits
                </p>
                <p className="text-xs text-indigo-300 font-manrope">
                  Join our exclusive early access community shaping the future of cattery bookings
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image Section - Heavily Optimized */}
          <div className="relative lg:order-2">
            <div className="relative mx-auto max-w-lg">
              {/* Optimized hero image with multiple formats */}
              <PerformanceOptimizedImage
                src="/images/hero-cattery.jpg"
                webpSrc="/images/hero-cattery.webp"
                mobileSrc="/images/hero-cattery-mobile.webp"
                alt="Premium cattery environment showcasing comfortable spaces for cats with modern amenities"
                width={600}
                height={400}
                priority={true}
                className="rounded-2xl shadow-2xl hw-accelerated prevent-cls"
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoad={handleImageLoad}
              />
              
              {/* Overlay elements with optimized animations */}
              <div className={`absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                ✅ Verified Premium
              </div>
              
              <div className={`absolute -bottom-4 -left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">🐱</div>
                  </div>
                  <span className="text-sm">1,247 cat parents joined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionOptimized;