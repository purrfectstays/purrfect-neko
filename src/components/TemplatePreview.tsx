import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Check, Shield, Clock, Users, BarChart3, MapPin, TrendingUp } from 'lucide-react';
import Header from './Header';
import SocialProof from './SocialProof';
import RegionalUrgency from './RegionalUrgency';
import { useApp } from '../context/AppContext';
import { useProgressiveEnhancement } from '../hooks/useProgressiveEnhancement';
import InlineRegistrationForm from './template-preview/InlineRegistrationForm';
import AnimatedPerfect from './template-preview/AnimatedPerfect';
import CatteryOwnerCTA from './template-preview/CatteryOwnerCTA';
import MobileStickyCTA from './template-preview/MobileStickyCTA';

// Lazy load non-critical components for better performance


const TemplatePreview: React.FC = () => {
  const { setCurrentStep } = useApp();
  const { deviceInfo, shouldLoadEnhanced } = useProgressiveEnhancement();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Function to scroll to registration form
  const scrollToRegistration = () => {
    const registrationElement = document.querySelector('[data-registration-form]');
    if (registrationElement) {
      registrationElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Focus on email input after scroll (with cleanup)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 500);
    } else {
      // Fallback: scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const [waitlistStats, setWaitlistStats] = useState<{
    totalUsers: number;
    verifiedUsers: number;
    completedQuizzes: number;
  } | null>(null);


  useEffect(() => {
    // Use honest community building messaging
    setWaitlistStats(null); // Don't show fake numbers
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Use proper Header component */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Social Proof #1 - Real Data */}
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                  {waitlistStats ? 
                    `TRUSTED BY ${waitlistStats.totalUsers}+ CAT PARENTS IN WAITLIST` : 
                    'BUILDING FOUNDING COMMUNITY'
                  }
                </span>
              </div>

              {/* Dream Outcome Headline - Cat Parent Focused */}
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Find <AnimatedPerfect /> Cat Care Near You
              </h1>

              {/* Pain Point and Solution - Cat Parent Focused */}
              <div className="space-y-4">
                <p className="text-xl lg:text-2xl text-green-400 font-semibold">
                  Stop settling for "just okay" catteries • No more last-minute scrambling • Peace of mind guaranteed
                </p>
                <p className="text-lg text-zinc-300">
                  Connect with premium, verified catteries in your area. See real-time availability, 
                  transparent pricing, and trusted reviews from local cat parents just like you.
                </p>
              </div>

              {/* Inline Registration Form */}
              <InlineRegistrationForm />

              {/* Cat Parent Benefits - Reduce Friction */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">100% FREE for cat parents</strong> - Always free to find care
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Instant access</strong> to premium cat travel checklist ($47 value)
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Be first to book</strong> when we launch in your area (Q4 2025)
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <img 
                src="/landingpageimage1.jpg" 
                alt="Happy cats in premium cattery environment"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl border-4 border-indigo-500/20"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
                ⭐ 5-Star Catteries Only
              </div>
              
              {/* Feature badge */}
              <div className="absolute -bottom-4 -left-4 bg-zinc-800/95 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 shadow-xl">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">Local catteries near you</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Urgency Component */}
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-8">
        <RegionalUrgency variant="banner" showDetails={true} />
      </div>

      {/* Cat Parent Pain Point Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Finding Quality Cat Care Shouldn't Be This Hard
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              You love your cat like family, but finding trustworthy care feels impossible. Endless Google searches, 
              unanswered calls, no real availability info, and wondering "Is this place actually good?" 
              You deserve better than crossing your fingers and hoping for the best.
            </p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                const registrationElement = document.getElementById('register');
                if (registrationElement) {
                  registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              GET EARLY ACCESS TO BETTER CAT CARE
            </button>
          </div>
        </div>
      </section>

      {/* Community Engagement Section */}
      <section className="py-16 bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-white mb-12">
            Building Together: Community Engagement
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <div className="bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-center">Community Input</h4>
                <p className="text-zinc-300 text-sm text-center">
                  Every founding member shapes features through our qualification quiz and ongoing feedback
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-2 text-center">Regional Expansion</h4>
                <p className="text-zinc-300 text-sm text-center">
                  Launch cities determined by founding community demand and cattery partner availability
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src="/landingpageimage3.jpg" 
                alt="Multiple cats relaxing together in a premium cattery environment showing social & comfortable spaces"
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl border-4 border-purple-500/20"
              />
              
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 bg-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                🐱 Social & comfortable spaces
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              JOIN THE MOVEMENT
            </button>
          </div>
        </div>
      </section>

      {/* How It Works for Cat Parents */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How Purrfect Stays Works for You
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Finding quality cat care should be simple, transparent, and stress-free
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search Near You</h3>
              <p className="text-zinc-300">Enter your location and dates to see verified catteries with real availability</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Compare & Choose</h3>
              <p className="text-zinc-300">Read reviews from local cat parents, see photos, and compare transparent pricing</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Book Instantly</h3>
              <p className="text-zinc-300">Reserve your spot with confidence - no phone tag, no uncertainty</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const registrationElement = document.querySelector('[data-registration-form]');
                if (registrationElement) {
                  registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              BE FIRST TO ACCESS THIS
            </button>
          </div>
        </div>
      </section>

      {/* Cat Parent Value Props Section */}
      <section className="py-16 bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                FOR CAT PARENTS
              </h3>
              <h2 className="text-3xl font-bold text-white">
                Finally, Cat Care You Can Trust
              </h2>
              <p className="text-lg text-zinc-300">
                Every cattery on Purrfect Stays is verified, reviewed by real cat parents, and committed to transparency. 
                See real-time availability, honest pricing, and book with confidence - all completely FREE for cat parents.
              </p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const registrationElement = document.querySelector('[data-registration-form]');
                  if (registrationElement) {
                    registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                      if (emailInput) emailInput.focus();
                    }, 500);
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
              >
                JOIN THE WAITLIST
              </button>
            </div>
            <div className="relative">
              <img 
                src="/landingpageimage2.jpg" 
                alt="Premium cattery facilities and services"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl border-4 border-green-500/20"
              />
              
              {/* Overlay badge */}
              <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                🏆 Premium cattery facilities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cat Parent Benefits Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Makes Purrfect Stays Different for Cat Parents
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Verified Quality</h3>
              <p className="text-zinc-300 text-sm">Every cattery passes our verification process - licensing, facilities, and care standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Real Parent Reviews</h3>
              <p className="text-zinc-300 text-sm">Read honest reviews from cat parents in your area - no fake testimonials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Real-Time Availability</h3>
              <p className="text-zinc-300 text-sm">See actual availability and book instantly - no more phone tag</p>
            </div>
          </div>
          <div className="text-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const registrationElement = document.querySelector('[data-registration-form]');
                if (registrationElement) {
                  registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              GET FIRST ACCESS
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section 2 */}
      <section className="py-16 bg-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-white mb-12">
            Join Our Growing Community
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">
                {waitlistStats ? `${waitlistStats.totalUsers}+` : 'Growing'}
              </div>
              <span className="text-zinc-300">Total Members</span>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">
                {waitlistStats ? `${waitlistStats.verifiedUsers}+` : 'Active'}
              </div>
              <span className="text-zinc-300">Verified Members</span>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400">
                {waitlistStats ? `${waitlistStats.completedQuizzes}+` : 'Engaged'}
              </div>
              <span className="text-zinc-300">Completed Profiles</span>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                const registrationElement = document.querySelector('[data-registration-form]');
                if (registrationElement) {
                  registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              BE PART OF SOMETHING BIG
            </button>
          </div>
        </div>
      </section>

      {/* Cattery Owner Section */}
      <section className="py-16 bg-zinc-800/30 border-y border-zinc-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Are You a Cattery Owner?
            </h2>
            <p className="text-lg text-zinc-300">
              Join our partner network to connect with quality-focused cat parents in your area
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-purple-500/30">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Quality Customers</h3>
                <p className="text-zinc-400 text-sm">Connect with cat parents who value premium care</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-purple-500/30">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Business Tools</h3>
                <p className="text-zinc-400 text-sm">Manage bookings and grow your business efficiently</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-6 border border-purple-500/30">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Fair Pricing</h3>
                <p className="text-zinc-400 text-sm">Transparent, affordable fees - no surprises</p>
              </div>
            </div>
            
            {/* Cattery Registration Form */}
            <div className="max-w-md mx-auto mt-8">
              <CatteryOwnerCTA />
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">When will Purrfect Stays launch?</h3>
              <p className="text-zinc-300">We're targeting Q4 2025 for our beta launch with founding community members. The full platform will roll out city by city based on demand and cattery partner availability.</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">Is it really free for cat parents?</h3>
              <p className="text-zinc-300">Yes! Purrfect Stays will always be 100% free for cat parents. We believe finding quality care for your cat shouldn't cost extra. Catteries pay a small subscription fee for our business tools.</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">How do you verify catteries?</h3>
              <p className="text-zinc-300">We're developing a comprehensive verification process including licensing checks, facility standards, staff qualifications, and ongoing quality monitoring through customer feedback.</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">What cities will you launch in first?</h3>
              <p className="text-zinc-300">Launch cities will be determined by founding community demand. The more people who join from your area, the higher priority it gets. Join now to bring Purrfect Stays to your city!</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">Can I invest in Purrfect Stays?</h3>
              <p className="text-zinc-300">We're currently bootstrapping and focused on community building. Join our founding community to stay updated on future investment opportunities.</p>
            </div>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-800/50">
              <h3 className="font-semibold text-white mb-2">How can cattery owners get involved?</h3>
              <p className="text-zinc-300">Join our waitlist and select "Cattery Owner" in the quiz. You'll get early access to partner with us, influence platform features, and lock in founding partner pricing.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const registrationElement = document.querySelector('[data-registration-form]');
                if (registrationElement) {
                  registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput) emailInput.focus();
                  }, 500);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              JOIN NOW - NO COMMITMENT
            </button>
          </div>
        </div>
      </section>

      {/* SocialProof Component */}
      <SocialProof />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/landingpageimage4.jpg" 
                alt="Happy cats enjoying premium cattery care"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                🚀 Launching Q4 2025
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-zinc-300 font-medium">
                  {waitlistStats ? 
                    `${waitlistStats.totalUsers}+ FOUNDING MEMBERS AND GROWING` : 
                    'FOUNDING MEMBERS COMMUNITY GROWING'
                  }
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Your Cat Deserves Better Than "Good Enough"
              </h2>
              <p className="text-lg text-zinc-300">
                Stop settling for uncertainty when it comes to your cat's care. Join our founding community now to 
                get instant access to premium cat care resources and be first to access trusted catteries when 
                we launch in your area.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Free premium cat travel checklist ($47 value)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Direct input on features and launch cities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">First access when we launch (Q4 2025)</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const registrationElement = document.querySelector('[data-registration-form]');
                  if (registrationElement) {
                    registrationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      const emailInput = registrationElement.querySelector('input[type="email"]') as HTMLInputElement;
                      if (emailInput) emailInput.focus();
                    }, 500);
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all cursor-pointer inline-flex items-center justify-center space-x-2 text-lg"
              >
                <span>FIND TRUSTED CAT CARE FIRST</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-zinc-400">🔒 No credit card • No spam • Unsubscribe anytime</p>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA />

      {/* Add bottom padding to prevent overlap */}
      <div className="h-20 lg:h-24"></div>
    </div>
  );
};

export default TemplatePreview;