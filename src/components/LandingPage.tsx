import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Users, Clock, Shield, TrendingUp, Search, Calendar, BarChart3, Zap, MapPin } from 'lucide-react';
import Header from './Header';
import SocialProof from './SocialProof';
import RegionalUrgency from './RegionalUrgency';
import OptimizedImage from './OptimizedImage';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { useApp } from '../context/AppContext';

// Animated text cycling component
const AnimatedPerfect: React.FC = () => {
  const words = ['Perfect', 'Premium', 'Trusted', 'Quality', 'Caring', 'Expert'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span 
      className={`transition-all duration-300 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-bold ${
        isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
      }`}
    >
      {words[currentWordIndex]}
    </span>
  );
};

// Mobile-First Hero Section with Prominent CTAs
const MobileOptimizedHeroSection: React.FC = () => {
  const { setCurrentStep } = useApp();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section - Mobile First */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Main headline - Honest positioning */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
                We're Building the{' '}
                <span className="block mt-1 lg:mt-2">
                  <AnimatedPerfect />
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-1 lg:mt-2 text-indigo-400">
                  Cattery Platform
                </span>
              </h1>
              
              {/* Enhanced value proposition with lead magnet */}
              <div className="space-y-2 lg:space-y-3">
                <p className="text-lg sm:text-xl lg:text-2xl text-green-400 font-semibold">
                  Join Founding Members & Get Instant Access to Our Cattery Evaluation Resources
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-zinc-300">
                  Help shape the platform + receive premium resources while we build • Launching Q4 2025
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-indigo-500/20 border border-green-500/30 rounded-lg p-3 lg:p-4">
                  <p className="text-sm lg:text-base text-green-300 font-medium">
                    🎁 <span className="text-green-400 font-bold">FREE</span> Resources for Founding Members
                  </p>
                </div>
              </div>
            </div>

            {/* Development Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 py-4 lg:py-6">
              <div className="flex items-center justify-center space-x-2 text-zinc-300 bg-zinc-800/30 rounded-lg p-3">
                <Users className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" />
                <span className="text-sm lg:text-base font-medium">Community Building</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-zinc-300 bg-zinc-800/30 rounded-lg p-3">
                <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400" />
                <span className="text-sm lg:text-base font-medium">Market Research</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-zinc-300 bg-zinc-800/30 rounded-lg p-3">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-400" />
                <span className="text-sm lg:text-base font-medium">Q4 2025 Launch</span>
              </div>
            </div>

            {/* Founding Community Benefits - Honest */}
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 lg:p-6">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                  <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
                  <h3 className="font-bold text-sm lg:text-base text-green-400">For Cat Parents</h3>
                </div>
                <p className="text-xs lg:text-sm text-zinc-300">
                  Shape platform features you need • Instant access to resource toolkit • First beta access • Connect with global cat community • Founding member benefits
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 lg:p-6">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400" />
                  <h3 className="font-bold text-sm lg:text-base text-purple-400">For Cattery Owners</h3>
                </div>
                <p className="text-xs lg:text-sm text-zinc-300">
                  Influence SaaS platform design • Early partner access • Business toolkit & visibility guides • Connect with potential customers • Founding partner pricing
                </p>
              </div>
            </div>

            {/* Primary CTAs - Desktop Aligned */}
            <div className="space-y-4">
              {/* CTA Buttons Row - Aligned on Desktop */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                {/* Enhanced Primary CTA */}
                <button
                  onClick={() => setCurrentStep('registration')}
                  className="w-full sm:w-auto group bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-5 rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 inline-flex items-center justify-center space-x-3"
                >
                  <span>Get My Resource Toolkit + Founding Access</span>
                  <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Enhanced Secondary CTA */}
                <button
                  onClick={() => setCurrentStep('registration')}
                  className="w-full sm:w-auto bg-purple-600/80 border border-purple-500 text-white font-semibold text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-5 rounded-full hover:bg-purple-700/80 transition-all duration-300"
                >
                  Join Community + Free Resources
                </button>
              </div>

              {/* Enhanced Benefits with Toolkit Details */}
              <div className="text-center lg:text-left space-y-3">
                <p className="text-xs lg:text-sm text-zinc-400">
                  🎁 Instant download + community access • 🔒 No commitment • 🚀 Help shape the platform
                </p>
                
                {/* Toolkit Value Stack */}
                <div className="bg-zinc-800/30 border border-indigo-500/30 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-indigo-400">Your Premium Cattery Evaluation Toolkit Includes:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>50-page Premium Cat Travel Guide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Cattery Safety Checklist (scored)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Regional Pricing Database</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Emergency Contact Templates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Section - Mobile Optimized */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <OptimizedImage 
                src="/landingpageimage1.jpg" 
                alt="Two beautiful cats relaxing together in a premium cattery environment"
                className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl shadow-2xl border-4 border-indigo-500/20"
                priority={true}
                aspectRatio="4:3"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-zinc-800/95 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-indigo-500/30 shadow-xl">
                <p className="text-sm lg:text-base font-semibold text-white">
                  🏠 Premium cattery comfort
                </p>
              </div>
              <div className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-green-500 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full font-bold text-xs lg:text-sm shadow-lg animate-bounce-slow">
                ⭐ 5-Star Care
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Streamlined Value Proposition for Mobile
const MobileValueProposition: React.FC = () => {
  const catParentBenefits = [
    { 
      icon: MapPin, 
      title: "Find Nearby Catteries", 
      desc: "Smart location-based search shows distance, travel time, and availability",
      highlight: "Local Discovery"
    },
    { 
      icon: Search, 
      title: "Smart Matching", 
      desc: "Advanced filtering to find catteries matching your cat's specific needs",
      highlight: "Always FREE"
    },
    { 
      icon: Calendar, 
      title: "Easy Booking", 
      desc: "Real-time availability checking and simplified booking process",
      highlight: "Save Time"
    },
    { 
      icon: Shield, 
      title: "Verified Network", 
      desc: "Comprehensive verification ensures quality and safety standards",
      highlight: "Safety First"
    }
  ];

  const catteryOwnerBenefits = [
    { 
      icon: MapPin, 
      title: "Local Visibility", 
      desc: "Appear automatically when cat parents search your area",
      highlight: "Local Discovery"
    },
    { 
      icon: Users, 
      title: "Quality Leads", 
      desc: "Connect with pre-qualified cat parents actively seeking services",
      highlight: "Quality Connections"
    },
    { 
      icon: BarChart3, 
      title: "Business Tools", 
      desc: "Dashboard with booking management, analytics, and communication",
      highlight: "Streamline Operations"
    },
    { 
      icon: Zap, 
      title: "Automation", 
      desc: "Automated booking confirmations, reminders, and payment processing",
      highlight: "Increase Efficiency"
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 lg:mb-4">
            Building Together: Where We Are
          </h2>
          <p className="text-lg lg:text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            Transparency is key. Here's exactly where we are in building your perfect cattery platform.
          </p>
          
          {/* Development Progress Section */}
          <div className="bg-zinc-800/50 rounded-xl p-6 lg:p-8 border border-zinc-700 max-w-4xl mx-auto mb-12">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span>Platform Development Status</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-left">
                    <h4 className="font-semibold text-green-400">Market Research & Community Building</h4>
                    <p className="text-zinc-400 text-sm">Gathering user needs, regional demand, and pricing insights</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-left">
                    <h4 className="font-semibold text-yellow-400">Cattery Partner Recruitment</h4>
                    <p className="text-zinc-400 text-sm">Building our network of verified cattery partners</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-400">Platform Development</h4>
                    <p className="text-zinc-400 text-sm">Building real-time booking, availability, and communication features</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-400">Beta Launch</h4>
                    <p className="text-zinc-400 text-sm">Q4 2025: First live bookings with founding community members</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-600">
              <p className="text-sm text-zinc-400 text-center">
                📊 <strong className="text-white">Your participation matters:</strong> Every quiz response and feedback helps us prioritize features and cattery recruitment in your region.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Cat Parents Section */}
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3 lg:mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
                </div>
                <h3 className="font-bold text-xl lg:text-2xl text-green-400">
                  For Cat Parents
                </h3>
                <div className="bg-green-500 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-bold">
                  FREE PLATFORM
                </div>
              </div>
              <p className="text-base lg:text-lg text-zinc-300">
                Find quality cattery care with confidence and ease
              </p>
            </div>

            {/* Mobile-optimized feature list */}
            <div className="space-y-3 lg:space-y-4">
              {catParentBenefits.map((benefit, index) => (
                <div key={index} className="bg-zinc-800/50 rounded-xl p-4 lg:p-6 border border-green-800/30">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <div className="bg-green-500/20 p-2 lg:p-3 rounded-lg flex-shrink-0">
                      <benefit.icon className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h4 className="font-semibold text-sm lg:text-base text-white truncate">
                          {benefit.title}
                        </h4>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ml-2">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="text-xs lg:text-sm text-zinc-300">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cattery Owners Section */}
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3 lg:mb-4">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-xl lg:text-2xl text-purple-400">
                  For Cattery Owners
                </h3>
                <div className="bg-purple-500 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-bold">
                  EARLY ACCESS
                </div>
              </div>
              <p className="text-base lg:text-lg text-zinc-300">
                Grow your cattery business with modern tools
              </p>
            </div>

            {/* Mobile-optimized feature list */}
            <div className="space-y-3 lg:space-y-4">
              {catteryOwnerBenefits.map((benefit, index) => (
                <div key={index} className="bg-zinc-800/50 rounded-xl p-4 lg:p-6 border border-purple-800/30">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <div className="bg-purple-500/20 p-2 lg:p-3 rounded-lg flex-shrink-0">
                      <benefit.icon className="h-4 w-4 lg:h-5 lg:w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h4 className="font-semibold text-sm lg:text-base text-white truncate">
                          {benefit.title}
                        </h4>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ml-2">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="text-xs lg:text-sm text-zinc-300">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// TEST: Simple fixed positioned element
const MobileStickyCTA: React.FC = () => {
  const { setCurrentStep } = useApp();
  
  console.log('MobileStickyCTA rendering!');
  
  return (
    <div 
      id="test-mobile-cta"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        borderRadius: '10px',
        width: '200px',
        height: '100px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>TEST COMPONENT</div>
        <button
          onClick={() => alert('Test button 1')}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px'
          }}
        >
          Test Button 1
        </button>
        <button
          onClick={() => alert('Test button 2')}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px'
          }}
        >
          Test Button 2
        </button>
      </div>
    </div>
  );
};

// Final CTA Section with Urgency
const FinalCTA: React.FC = () => {
  const { setCurrentStep } = useApp();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
          Ready to Join Our Founding Community?
        </h2>
        <p className="text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8">
          Help us build the cattery platform cat parents and owners actually need
        </p>
        
        {/* Trust badges - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="flex items-center justify-center text-gray-300 bg-zinc-800/30 rounded-lg p-3">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm lg:text-base font-medium">Free to join</span>
          </div>
          <div className="flex items-center justify-center text-gray-300 bg-zinc-800/30 rounded-lg p-3">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm lg:text-base font-medium">No commitment</span>
          </div>
          <div className="flex items-center justify-center text-gray-300 bg-zinc-800/30 rounded-lg p-3">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm lg:text-base font-medium">Early access benefits</span>
          </div>
        </div>
        
        {/* CTA Buttons - Mobile optimized */}
        <div className="space-y-4">
          <button 
            onClick={() => setCurrentStep('registration')}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-bold transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center space-x-3"
          >
            <span>Join Founding Community + Get Free Guides</span>
            <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          
          {/* Community indicator */}
          <p className="text-sm lg:text-base text-gray-400">
            <span className="text-indigo-400">🚀</span> Join other cat lovers building the future of cattery care
          </p>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  // Track detailed user behavior for conversion optimization
  useBehaviorTracking('landing_page', {
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackClickHeatmap: true,
    trackFormInteractions: false
  });

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main>
        <MobileOptimizedHeroSection />
        <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
          <RegionalUrgency variant="banner" showDetails={true} />
        </div>
        <MobileValueProposition />
        <SocialProof />
      </main>
      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
      {/* Add bottom padding to prevent overlap */}
      <div className="h-20 lg:h-24"></div>
    </div>
  );
};

export default LandingPage;