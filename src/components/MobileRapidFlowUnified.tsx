import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ArrowRight, 
  Check, 
  Shield, 
  Star, 
  Zap, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Configuration interface for MobileRapidFlow variants
 */
export interface MobileRapidFlowConfig {
  // Basic features (always available)
  basic: {
    quickRegistration: boolean;
    socialProof: boolean;
    valueProposition: boolean;
  };
  
  // Optimized features
  optimized: {
    swipeGestures: boolean;
    networkMonitoring: boolean;
    performanceTracking: boolean;
    offlineSupport: boolean;
    lazyLoading: boolean;
  };
  
  // Ultra features  
  ultra: {
    accessibility: boolean;
    bundleOptimization: boolean;
    customIcons: boolean;
    advancedAnimations: boolean;
    detailedAnalytics: boolean;
  };
}

/**
 * Preset configurations matching original variants
 */
export const MOBILE_RAPID_FLOW_PRESETS = {
  basic: {
    basic: { quickRegistration: true, socialProof: true, valueProposition: true },
    optimized: { swipeGestures: false, networkMonitoring: false, performanceTracking: false, offlineSupport: false, lazyLoading: false },
    ultra: { accessibility: false, bundleOptimization: false, customIcons: false, advancedAnimations: false, detailedAnalytics: false }
  } as MobileRapidFlowConfig,
  
  optimized: {
    basic: { quickRegistration: true, socialProof: true, valueProposition: true },
    optimized: { swipeGestures: true, networkMonitoring: true, performanceTracking: true, offlineSupport: true, lazyLoading: true },
    ultra: { accessibility: false, bundleOptimization: false, customIcons: false, advancedAnimations: false, detailedAnalytics: false }
  } as MobileRapidFlowConfig,
  
  ultra: {
    basic: { quickRegistration: true, socialProof: true, valueProposition: true },
    optimized: { swipeGestures: true, networkMonitoring: true, performanceTracking: true, offlineSupport: true, lazyLoading: true },
    ultra: { accessibility: true, bundleOptimization: true, customIcons: true, advancedAnimations: true, detailedAnalytics: true }
  } as MobileRapidFlowConfig
};

interface MobileRapidFlowUnifiedProps {
  config?: MobileRapidFlowConfig;
  variant?: 'basic' | 'optimized' | 'ultra';
  className?: string;
}

/**
 * Unified MobileRapidFlow component that consolidates all variants
 * Supports configuration-based feature toggles and preset variants
 */
const MobileRapidFlowUnified: React.FC<MobileRapidFlowUnifiedProps> = ({
  config,
  variant = 'basic',
  className = ''
}) => {
  // Use preset config if none provided
  const activeConfig = config || MOBILE_RAPID_FLOW_PRESETS[variant];
  
  // State management
  const { setCurrentStep } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Network monitoring (if enabled)
  useEffect(() => {
    if (!activeConfig.optimized.networkMonitoring) return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeConfig.optimized.networkMonitoring]);
  
  // Performance tracking (if enabled)
  useEffect(() => {
    if (!activeConfig.optimized.performanceTracking) return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`MobileRapidFlow render time: ${endTime - startTime}ms`);
    };
  }, [activeConfig.optimized.performanceTracking]);
  
  // Swipe gesture handling (if enabled)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!activeConfig.optimized.swipeGestures) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [activeConfig.optimized.swipeGestures]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!activeConfig.optimized.swipeGestures) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [activeConfig.optimized.swipeGestures]);
  
  const handleTouchEnd = useCallback(() => {
    if (!activeConfig.optimized.swipeGestures || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [activeConfig.optimized.swipeGestures, touchStart, touchEnd, currentSlide]);
  
  // Slide data
  const slides = useMemo(() => [
    {
      title: "Find Perfect Catteries",
      subtitle: "Real-time availability",
      icon: MapPin,
      description: "Skip the endless searching. See which quality catteries have space right now.",
      cta: "See Available Spots"
    },
    {
      title: "Verified Quality",
      subtitle: "5-star standard",
      icon: Shield,
      description: "Every cattery is vetted for safety, cleanliness, and genuine care.",
      cta: "View Quality Standards"
    },
    {
      title: "Instant Booking",
      subtitle: "Book in seconds",
      icon: Zap,
      description: "Reserve your spot instantly. No phone tag, no waiting for callbacks.",
      cta: "Try Instant Booking"
    }
  ], []);
  
  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [slides.length]);
  
  // Keyboard navigation (if accessibility enabled)
  useEffect(() => {
    if (!activeConfig.ultra.accessibility) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeConfig.ultra.accessibility, currentSlide, slides.length]);
  
  const handleRegister = () => {
    if (activeConfig.ultra.detailedAnalytics) {
      console.log('MobileRapidFlow: User clicked register', { variant, slide: currentSlide });
    }
    setCurrentStep('registration');
  };
  
  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;
  
  return (
    <div 
      ref={containerRef}
      className={`bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen flex flex-col p-4 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...(activeConfig.ultra.accessibility && {
        role: 'main',
        'aria-label': 'Mobile rapid flow registration'
      })}
    >
      {/* Network status (if enabled) */}
      {activeConfig.optimized.networkMonitoring && !isOnline && (
        <div className="bg-red-500 text-white p-2 text-center text-sm mb-4 rounded">
          <WifiOff className="w-4 h-4 inline mr-2" />
          You're offline. Some features may be limited.
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Purrfect Stays
        </h1>
        <p className="text-zinc-400 text-sm">
          Quality cat care, when you need it
        </p>
      </div>
      
      {/* Main content slider */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-xl font-bold text-white mb-1">
              {currentSlideData.title}
            </h2>
            <p className="text-indigo-300 text-sm font-medium">
              {currentSlideData.subtitle}
            </p>
          </div>
          
          {/* Description */}
          <p className="text-zinc-300 text-center mb-8 leading-relaxed">
            {currentSlideData.description}
          </p>
          
          {/* CTA Button */}
          <button
            onClick={handleRegister}
            className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 mb-6 ${
              activeConfig.ultra.advancedAnimations ? 'transform hover:scale-105' : ''
            }`}
            {...(activeConfig.ultra.accessibility && {
              'aria-label': `Register now - ${currentSlideData.cta}`
            })}
          >
            <span>Get Early Access</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-indigo-400 w-6' : 'bg-zinc-600'
              }`}
              {...(activeConfig.ultra.accessibility && {
                'aria-label': `Go to slide ${index + 1}`,
                'aria-current': index === currentSlide ? 'true' : 'false'
              })}
            />
          ))}
        </div>
        
        {/* Navigation arrows (if swipe gestures enabled) */}
        {activeConfig.optimized.swipeGestures && (
          <div className="flex justify-between items-center mt-4 px-4">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-full bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              {...(activeConfig.ultra.accessibility && {
                'aria-label': 'Previous slide'
              })}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-full bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              {...(activeConfig.ultra.accessibility && {
                'aria-label': 'Next slide'
              })}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Social proof (if enabled) */}
      {activeConfig.basic.socialProof && (
        <div className="text-center py-6">
          <div className="flex justify-center items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-zinc-400 text-sm">
            Trusted by 10,000+ cat parents worldwide
          </p>
        </div>
      )}
      
      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-zinc-500 text-xs">
          Join the waitlist • No commitment • Early access perks
        </p>
      </div>
    </div>
  );
};

export default MobileRapidFlowUnified;