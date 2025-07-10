import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import HeroSection from './HeroSection';
import ValueProposition from './ValueProposition';
import SocialProof from './SocialProof';
import RegionalUrgency from './RegionalUrgency';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';

// New optimized components for preview
const OptimizedHeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-900 pt-16 pb-20">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Clearer, more direct headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Book Trusted Cat Boarding
          <span className="block text-3xl md:text-4xl mt-2 text-indigo-400">
            While You Travel
          </span>
        </h1>
        
        {/* Simplified value prop */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Verified catteries with daily photo updates
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm md:text-base">
          <span className="flex items-center text-gray-300">
            <span className="text-green-400 mr-2">✓</span> 127 Verified Catteries
          </span>
          <span className="flex items-center text-gray-300">
            <span className="text-green-400 mr-2">✓</span> 2,847 Happy Cat Parents
          </span>
          <span className="flex items-center text-gray-300">
            <span className="text-green-400 mr-2">✓</span> Daily Photo Updates
          </span>
        </div>

        {/* Clearer CTA */}
        <button 
          onClick={() => window.location.href = '/register'}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
        >
          Find Catteries Near Me
          <span className="block text-sm font-normal mt-1 opacity-90">
            Free to join • No credit card required
          </span>
        </button>

        {/* Social proof below CTA */}
        <p className="mt-6 text-gray-400 text-sm">
          Join 43 cat parents who signed up today
        </p>
      </div>
    </section>
  );
};

const SimplifiedValueProp: React.FC = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Personally Verified',
      description: 'Every cattery inspected by our team'
    },
    {
      icon: '📸',
      title: 'Daily Updates',
      description: 'Photos & videos sent to your phone'
    },
    {
      icon: '💰',
      title: 'Clear Pricing',
      description: 'No hidden fees, ever'
    },
    {
      icon: '🛡️',
      title: '24/7 Support',
      description: 'Always here when you need us'
    }
  ];

  return (
    <section className="py-16 bg-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Why Cat Parents Trust Us
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Tell us about your cat',
      description: 'Quick 2-minute quiz about needs'
    },
    {
      number: '2',
      title: 'Get matched instantly',
      description: 'See catteries that fit perfectly'
    },
    {
      number: '3',
      title: 'Book with confidence',
      description: 'Secure booking, daily updates'
    }
  ];

  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <svg className="w-8 h-8 text-gray-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your Cat's Perfect Holiday Home?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join 2,847 cat parents who've already secured their spot on the waitlist
        </p>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center text-gray-300">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free to join
          </div>
          <div className="flex items-center text-gray-300">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card required
          </div>
          <div className="flex items-center text-gray-300">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            2-minute signup
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = '/register'}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 shadow-xl inline-flex items-center"
        >
          Join the Waitlist Now
          <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        
        {/* Urgency indicator */}
        <p className="mt-6 text-gray-400">
          <span className="text-yellow-400">⚡</span> 12 cat parents joined in the last hour
        </p>
      </div>
    </section>
  );
};

// Preview Toggle Component - Always visible in dev
const PreviewToggle: React.FC<{ isPreview: boolean; onToggle: () => void }> = ({ isPreview, onToggle }) => {
  // Always show in development
  return (
    <div className="fixed bottom-20 right-4 z-50 bg-black/90 p-4 rounded-lg border border-indigo-500 shadow-xl">
      <p className="text-white text-sm mb-2 font-semibold">Preview Mode</p>
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          isPreview 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}
      >
        {isPreview ? 'Viewing: New Design' : 'Viewing: Current Design'}
      </button>
      <p className="text-gray-400 text-xs mt-2">
        Or use ?preview=true
      </p>
    </div>
  );
};

const LandingPagePreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Check URL parameter or localStorage
    const urlPreview = searchParams.get('preview') === 'true';
    const storagePreview = localStorage.getItem('previewMode') === 'true';
    const shouldPreview = urlPreview || storagePreview;
    
    console.log('Preview mode check:', {
      urlPreview,
      storagePreview,
      shouldPreview
    });
    
    setIsPreview(shouldPreview);
  }, [searchParams]);

  const togglePreview = () => {
    const newValue = !isPreview;
    setIsPreview(newValue);
    localStorage.setItem('previewMode', String(newValue));
  };

  // Track behavior for both versions
  useBehaviorTracking(isPreview ? 'landing_page_new' : 'landing_page_current', {
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackClickHeatmap: true,
    trackFormInteractions: false
  });

  // Show new optimized version
  if (isPreview) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <main>
          <OptimizedHeroSection />
          <SimplifiedValueProp />
          <HowItWorks />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <RegionalUrgency variant="banner" showDetails={true} />
          </div>
          <SocialProof />
          <FinalCTA />
        </main>
        <div className="h-20"></div>
        <PreviewToggle isPreview={isPreview} onToggle={togglePreview} />
      </div>
    );
  }

  // Show current version
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main>
        <HeroSection />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <RegionalUrgency variant="banner" showDetails={true} />
        </div>
        <ValueProposition />
        <SocialProof />
      </main>
      <div className="h-20"></div>
      <PreviewToggle isPreview={isPreview} onToggle={togglePreview} />
    </div>
  );
};

export default LandingPagePreview;