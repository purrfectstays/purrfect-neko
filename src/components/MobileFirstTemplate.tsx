import React, { useState, useEffect, Suspense } from 'react';
import { ArrowRight, Mail, User, Star, Shield, Clock } from 'lucide-react';
import { useProgressiveEnhancement } from '../hooks/useProgressiveEnhancement';
import MobileFirstImage from './MobileFirstImage';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';
import { useApp } from '../context/AppContext';

// Lazy load desktop enhancements
const DesktopEnhancements = React.lazy(() => import('./DesktopEnhancements'));

// Mobile-first hero section
const MobileHero: React.FC = () => {
  return (
    <div className="hero-mobile">
      <h1 className="hero-title">
        Find Perfect Cat Care Near You
      </h1>
      <p className="hero-subtitle">
        Stop settling for "just okay" catteries • No more last-minute scrambling • Peace of mind guaranteed
      </p>
      
      {/* Mobile-optimized features */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center space-x-1 text-green-400">
          <Shield className="h-4 w-4" />
          <span>Verified</span>
        </div>
        <div className="flex items-center space-x-1 text-blue-400">
          <Clock className="h-4 w-4" />
          <span>Real-time</span>
        </div>
        <div className="flex items-center space-x-1 text-purple-400">
          <Star className="h-4 w-4" />
          <span>Premium</span>
        </div>
      </div>
    </div>
  );
};

// Mobile-first registration form
const MobileRegistration: React.FC = () => {
  const { setCurrentStep, setUser, setWaitlistUser, setVerificationToken } = useApp();
  const [formState, setFormState] = useState<'email' | 'name' | 'processing'>('email');
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    if (validateEmail(email)) {
      setIsValidEmail(true);
      setErrors({});
    } else {
      setIsValidEmail(false);
      if (formState === 'name') {
        setFormState('email');
      }
    }
  };

  const handleEmailBlur = () => {
    if (isValidEmail && formData.email.trim()) {
      setFormState('name');
    }
  };

  const handleSubmit = async () => {
    if (formState === 'name' && formData.name.trim()) {
      setIsSubmitting(true);
      try {
        const { user: waitlistUser, verificationToken } = await UnifiedEmailVerificationService.registerUser({
          name: formData.name,
          email: formData.email,
          userType: 'cat-parent',
        });

        setWaitlistUser(waitlistUser);
        setVerificationToken(verificationToken);
        setUser({
          id: waitlistUser.id,
          name: formData.name,
          email: formData.email,
          userType: 'cat-parent',
          isVerified: true,
          quizCompleted: false,
          waitlistPosition: waitlistUser.waitlist_position
        });

        setCurrentStep('quiz');
      } catch (error) {
        setErrors({ submit: 'Registration failed. Please try again.' });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mobile-register">
      <h2 className="text-xl font-bold text-center mb-4 text-green-400">
        Register as a PurrParent
      </h2>
      
      {/* Email Input */}
      <div className="relative mb-4">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
        <input
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          placeholder="Enter your email"
          className="mobile-input pl-10"
        />
        {isValidEmail && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      
      {/* Name Input - Shows when email is valid */}
      {formState === 'name' && (
        <div className="relative mb-4 animate-in slide-in-from-top-2 duration-300">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
            className="mobile-input pl-10"
            autoFocus
          />
        </div>
      )}
      
      {/* Submit Button */}
      {formState === 'name' && (
        <button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || isSubmitting}
          className="mobile-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Join Waitlist</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}
      
      {/* Mobile-optimized benefits */}
      <div className="mt-4 text-center">
        <p className="text-xs text-green-300 mb-2">
          🔒 Instant access • No verification needed • Direct to quiz
        </p>
        <p className="text-xs text-zinc-400">
          100% FREE for cat parents - Always free to find care
        </p>
      </div>
      
      {errors.submit && (
        <p className="text-red-400 text-sm text-center mt-2">{errors.submit}</p>
      )}
    </div>
  );
};

// Main mobile-first template component
const MobileFirstTemplate: React.FC = () => {
  const { deviceInfo, shouldLoadEnhanced } = useProgressiveEnhancement();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Progressive font loading
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
        document.body.classList.add('font-loaded');
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        setFontsLoaded(true);
        document.body.classList.add('font-loaded');
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20">
      {/* Mobile-first hero */}
      <MobileHero />
      
      {/* Mobile registration */}
      <div className="px-4 pb-8">
        <MobileRegistration />
      </div>
      
      {/* Hero image - mobile optimized */}
      <div className="px-4 pb-8">
        <MobileFirstImage
          mobileSrc="/7054d274-40cc-49d1-ba82-70530de86643.jpg"
          desktopSrc="/7054d274-40cc-49d1-ba82-70530de86643.jpg"
          alt="Two beautiful cats relaxing together in a premium cattery environment"
          className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
          priority={false}
          sizes="(max-width: 768px) 90vw, 400px"
        />
        
        <div className="text-center mt-4 p-3 bg-zinc-800/50 rounded-lg max-w-sm mx-auto">
          <p className="text-sm text-zinc-300">
            🏠 Premium cattery comfort • ⭐ 5-Star Care
          </p>
        </div>
      </div>
      
      {/* Progressive enhancement for desktop */}
      {shouldLoadEnhanced && (
        <Suspense fallback={<div className="h-0" />}>
          <DesktopEnhancements />
        </Suspense>
      )}
      
      {/* Preload critical resources */}
      <div className="preload-critical">
        <link rel="preload" href="/7054d274-40cc-49d1-ba82-70530de86643.jpg" as="image" />
      </div>
    </div>
  );
};

export default MobileFirstTemplate;