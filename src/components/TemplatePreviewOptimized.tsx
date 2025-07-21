import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, Clock, Users, Search, Calendar, BarChart3, Zap, MapPin, TrendingUp } from 'lucide-react';
import Header from './Header';
import SocialProof from './SocialProof';
import RegionalUrgency from './RegionalUrgency';
import PerformanceOptimizedImage from './PerformanceOptimizedImage';
import { useApp } from '../context/AppContext';
import { useProgressiveEnhancement } from '../hooks/useProgressiveEnhancement';

// Direct imports for stability (can optimize with lazy loading later)
import HeroSection from './landing/HeroSection';
import PainPointSection from './landing/PainPointSection';
import CommunityEngagementSection from './landing/CommunityEngagementSection';
import HowItWorksSection from './landing/HowItWorksSection';
import MobileStickyCTA from './template-preview/MobileStickyCTA';


// Cattery Owner CTA Component - optimized
const CatteryOwnerCTA: React.FC = () => {
  const { setCurrentStep } = useApp();

  const handleCatteryRegistration = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentStep('registration');
  };

  return (
    <div className="bg-purple-600/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400 shadow-2xl shadow-purple-400/20 mobile-optimized">
      <div className="space-y-6 text-center">
        <header>
          <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
            Register as a Cattery Owner
          </h3>
          <p className="text-lg text-purple-100 mb-6">
            Join our partner network and connect with quality cat parents in your area
          </p>
        </header>
        
        <button
          onClick={handleCatteryRegistration}
          className="critical-button w-full py-5 text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white flex items-center justify-center space-x-3 touch-target-optimized"
          aria-label="Become a partner cattery owner"
        >
          <span>BECOME A PARTNER</span>
          <ArrowRight className="w-6 h-6" aria-hidden="true" />
        </button>
        
        <p className="text-sm text-purple-200">
          🚀 Early partners get reduced fees • Priority placement • Founding benefits
        </p>
      </div>
    </div>
  );
};

const TemplatePreviewOptimized: React.FC = () => {
  const { currentStep, shouldLoadEnhanced } = useProgressiveEnhancement();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [waitlistStats, setWaitlistStats] = useState<{
    totalUsers: number;
    verifiedUsers: number;
    completedQuizzes: number;
  } | null>(null);

  // Optimized stats loading
  useEffect(() => {
    setWaitlistStats({
      totalUsers: 47,
      verifiedUsers: 35,
      completedQuizzes: 28
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 prevent-cls">
      <Header />

      {/* Hero Section - Critical above-the-fold content */}
      <HeroSection waitlistStats={waitlistStats} />

      {/* Regional Urgency - High priority */}
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
        <RegionalUrgency variant="banner" showDetails={true} />
      </div>

      {/* Pain Point Section - Core conversion element */}
      <PainPointSection />

      {/* Community Engagement - Social proof */}
      <CommunityEngagementSection />

      {/* How It Works - Value proposition */}
      <HowItWorksSection />

      {/* Cat Parent Value Props Section - Enhanced */}
      <section className="py-16 bg-zinc-800/50 section-contain">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                  FOR CAT PARENTS
                </p>
                <h2 className="text-3xl font-bold text-white font-loading">
                  Finally, Cat Care You Can Trust
                </h2>
              </div>
              <p className="text-lg text-zinc-300-accessible">
                Every cattery on Purrfect Stays is verified, reviewed by real cat parents, and committed to transparency. 
                See real-time availability, honest pricing, and book with confidence - all completely FREE for cat parents.
              </p>
              <button 
                onClick={() => {
                  const registrationElement = document.querySelector('[data-registration-form]');
                  if (registrationElement) {
                    registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                      if (emailInput) emailInput.focus();
                    }, 500);
                  }
                }}
                className="critical-button px-6 py-3 font-semibold touch-target-optimized"
                aria-label="Join the waitlist - scroll to registration form"
              >
                JOIN THE WAITLIST
              </button>
            </div>
            <div className="relative image-contain">
              <PerformanceOptimizedImage
                src="/landingpageimage3.jpg"
                alt="Beautiful cat with striking eyes showcasing the quality of care and attention cats receive"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl border-4 border-green-500/20 prevent-cls"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg mobile-optimized">
                💎 Premium quality care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cat Parent Benefits Section - Streamlined */}
      <section className="py-16 bg-zinc-900 section-contain">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-loading">
              What Makes Purrfect Stays Different for Cat Parents
            </h2>
          </header>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center mobile-optimized">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Verified & Trusted</h3>
              <p className="text-zinc-300-accessible">Every cattery is thoroughly vetted, licensed, and reviewed by real cat parents</p>
            </div>
            
            <div className="text-center mobile-optimized">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Availability</h3>
              <p className="text-zinc-300-accessible">See actual availability and book instantly - no more phone tag or uncertainty</p>
            </div>
            
            <div className="text-center mobile-optimized">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Free for Cat Parents</h3>
              <p className="text-zinc-300-accessible">No hidden fees, no membership costs - finding great care is always free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cattery Owner Section */}
      <section className="py-16 bg-zinc-800/50 section-contain">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <CatteryOwnerCTA />
            
            <div className="space-y-6">
              <header>
                <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  FOR CATTERY OWNERS
                </p>
                <h2 className="text-3xl font-bold text-white font-loading">
                  Grow Your Business with Premium Cat Parents
                </h2>
              </header>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span className="text-zinc-300-accessible">
                    <strong className="text-white">Founding partner benefits</strong> - Reduced fees and priority placement
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span className="text-zinc-300-accessible">
                    <strong className="text-white">Automated bookings</strong> - Streamline your operations with smart scheduling
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span className="text-zinc-300-accessible">
                    <strong className="text-white">Premium cat parents</strong> - Connect with quality customers who value great care
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SocialProof />
      </div>

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
};

export default TemplatePreviewOptimized;