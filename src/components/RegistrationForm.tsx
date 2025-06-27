import React, { useState } from 'react';
import { Mail, User, ArrowRight, ArrowLeft, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WaitlistService } from '../services/waitlistService';
import { EmailVerificationService } from '../services/emailVerificationService';
import { analytics } from '../lib/analytics';
import RegionalUrgency from './RegionalUrgency';
import { useGeolocation } from '../hooks/useGeolocation';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';

const RegistrationForm: React.FC = () => {
  const { setCurrentStep, setUser, setWaitlistUser } = useApp();
  const { location, waitlistData } = useGeolocation();
  
  // Track registration form behavior for optimization
  const { trackFormSubmission, trackCustomEvent } = useBehaviorTracking('registration_form', {
    trackScrollDepth: false,
    trackTimeOnPage: true,
    trackClickHeatmap: true,
    trackFormInteractions: true
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '' as 'cat-parent' | 'cattery-owner' | '',
    honeypot: '' // Hidden field for bot detection
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.userType) {
      newErrors.userType = 'Please select your user type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track registration start
    analytics.trackRegistrationStart();
    
    // Honeypot check - if filled, silently reject (bot detected)
    if (formData.honeypot) {
      console.log('Bot detected via honeypot field');
      return; // Silently fail without showing any error
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if user already exists
      const existingUser = await WaitlistService.getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: 'This email is already registered' });
        setIsSubmitting(false);
        return;
      }

      // Register new user
      const { user: waitlistUser } = await WaitlistService.registerUser({
        name: formData.name,
        email: formData.email,
        userType: formData.userType as 'cat-parent' | 'cattery-owner',
      });

      // Send verification email
      const verificationResult = await EmailVerificationService.sendVerificationEmail(
        waitlistUser.id,
        formData.email,
        formData.name,
        formData.userType as 'cat-parent' | 'cattery-owner'
      );

      if (!verificationResult.success) {
        throw new Error(verificationResult.error || 'Failed to send verification email');
      }

      // Track successful registration with enhanced analytics
      analytics.trackRegistrationComplete(formData.userType, waitlistUser.waitlist_position);

      // Track geographic market insights
      if (location && waitlistData) {
        analytics.trackGeographicInsight(
          location.country,
          location.region,
          formData.userType,
          waitlistData.currentPosition
        );
      }

      // Update app state
      setWaitlistUser(waitlistUser);
      setUser({
        name: formData.name,
        email: formData.email,
        userType: formData.userType as 'cat-parent' | 'cattery-owner',
        isVerified: false,
        quizCompleted: false,
      });
      
      // Track successful form submission
      trackFormSubmission('waitlist_registration', true);
      
      setCurrentStep('verification');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Track failed form submission
      trackFormSubmission('waitlist_registration', false, error instanceof Error ? error.message : 'Unknown error');
      
      // Track registration error
      analytics.trackError('registration_failed', error instanceof Error ? error.message : 'Unknown error');
      
      // Provide more specific error message for edge function failures
      if (error instanceof Error && error.message.includes('Edge Function')) {
        setErrors({ 
          submit: 'Failed to send verification email: Failed to send a request to the Edge Function. Please try again later.' 
        });
      } else {
        setErrors({ 
          submit: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentStep('landing')}
            className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-manrope">Back to Home</span>
          </button>
          
          <h1 className="font-manrope font-bold text-3xl text-white mb-4">
            Become an Early Access Member
          </h1>
          <p className="font-manrope text-zinc-300 mb-6">
            Join the exclusive community shaping the future of cattery bookings
          </p>
          
          {/* Regional Urgency */}
          <RegionalUrgency variant="banner" showDetails={false} className="mb-6" />
        </div>

        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-800/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users but visible to bots */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block font-manrope font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-manrope"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 font-manrope">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block font-manrope font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-manrope"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 font-manrope">{errors.email}</p>
              )}
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block font-manrope font-medium text-white mb-3">
                I am a...
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 hover:border-green-500 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="userType"
                    value="cat-parent"
                    checked={formData.userType === 'cat-parent'}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as 'cat-parent' }))}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <div className="font-manrope font-semibold text-white">Cat Parent</div>
                    </div>
                    <div className="font-manrope text-sm text-zinc-400 mt-1">
                      Looking for premium cattery services for my cats
                    </div>
                    <div className="font-manrope text-xs text-green-400 mt-2 font-semibold">
                      ✅ Platform designed to be FREE for cat parents
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 hover:border-purple-500 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="userType"
                    value="cattery-owner"
                    checked={formData.userType === 'cattery-owner'}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as 'cattery-owner' }))}
                    className="text-purple-500 focus:ring-purple-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <div className="font-manrope font-semibold text-white">Cattery Owner</div>
                    </div>
                    <div className="font-manrope text-sm text-zinc-400 mt-1">
                      I own/operate a cattery business
                    </div>
                    <div className="font-manrope text-xs text-purple-400 mt-2 font-semibold">
                      💰 Early Access: Help us determine fair pricing
                    </div>
                  </div>
                </label>
              </div>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-400 font-manrope">{errors.userType}</p>
              )}
            </div>

            {/* Dynamic Early Access Explanation for Cattery Owners */}
            {formData.userType === 'cattery-owner' && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-manrope font-semibold text-purple-400 mb-2">
                      🎯 Early Access Special: Help Shape Our Platform
                    </h4>
                    <ul className="font-manrope text-sm text-zinc-300 space-y-1">
                      <li>• <strong>Limited Offer:</strong> {waitlistData ? `${waitlistData.remainingSpots} spots remaining in ${waitlistData.country}` : 'Limited spots available by country'}</li>
                      <li>• <strong>Shape the platform</strong> - Your input determines features and pricing</li>
                      <li>• <strong>Exclusive to early access members</strong> - Never offered again</li>
                    </ul>
                    <p className="font-manrope text-xs text-purple-300 mt-2">
                      💡 Help us determine fair pricing through our qualification quiz
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cat Parent Benefits */}
            {formData.userType === 'cat-parent' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-manrope font-semibold text-green-400 mb-2">
                      🐱 Cat Parent Benefits
                    </h4>
                    <ul className="font-manrope text-sm text-zinc-300 space-y-1">
                      <li>• <strong>Platform designed to be FREE</strong> for cat parents</li>
                      <li>• <strong>Premium cattery search</strong> and booking features</li>
                      <li>• <strong>Early access</strong> to all new features</li>
                      <li>• <strong>Help shape the platform</strong> through our qualification quiz</li>
                    </ul>
                    <p className="font-manrope text-xs text-green-300 mt-2">
                      💡 Your feedback helps us build the perfect platform for cat parents
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 font-manrope text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-manrope font-bold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              onClick={() => analytics.trackCTAClick('secure_position', 'registration_form')}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Securing Your Spot...</span>
                </>
              ) : (
                <>
                  <span>Secure My Early Access Position</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-manrope text-sm text-zinc-400">
              By joining, you become an early access member with lifetime benefits.
              <br />
              <span className="text-indigo-300">Unsubscribe anytime • No spam guarantee</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;