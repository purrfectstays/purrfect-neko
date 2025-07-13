import React, { useState } from 'react';
import { Mail, User, ArrowRight, ArrowLeft, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';
import { analytics } from '../lib/analytics';
import RegionalUrgency from './RegionalUrgency';
import { useGeolocation } from '../hooks/useGeolocation';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { rateLimiter, RateLimiter } from '../lib/rateLimiter';

const RegistrationForm: React.FC = () => {
  const { setCurrentStep, setUser, setWaitlistUser, setVerificationToken } = useApp();
  const { location, waitlistData } = useGeolocation();
  
  // Track registration form behavior for optimization
  const { trackFormSubmission } = useBehaviorTracking('registration_form', {
    trackScrollDepth: false,
    trackTimeOnPage: true,
    trackClickHeatmap: true,
    trackFormInteractions: true
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    catteryName: '',
    userType: 'cattery-owner' as 'cat-parent' | 'cattery-owner',
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
    
    if (!formData.catteryName.trim()) {
      newErrors.catteryName = 'Cattery name is required';
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientId = RateLimiter.getClientIdentifier();
    const rateLimitResult = rateLimiter.isAllowed(clientId, 'registration');
    
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil((rateLimitResult.retryAfter || 0) / 60);
      setErrors({ 
        submit: `Too many registration attempts. Please try again in ${minutes} minutes.` 
      });
      return;
    }
    
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
      const existingUser = await UnifiedEmailVerificationService.getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: 'This email is already registered' });
        setIsSubmitting(false);
        return;
      }

      // Register new user (this automatically sends verification email)
      console.log('📝 Registering user:', formData);
      const { user: waitlistUser, verificationToken } = await UnifiedEmailVerificationService.registerUser({
        name: formData.name,
        email: formData.email,
        userType: formData.userType as 'cat-parent' | 'cattery-owner',
      });
      console.log('✅ User registered successfully:', waitlistUser);
      console.log('📧 Verification token created:', verificationToken ? 'Yes' : 'No');

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
      setVerificationToken(verificationToken);
      setUser({
        id: waitlistUser.id,
        name: formData.name,
        email: formData.email,
        userType: formData.userType as 'cat-parent' | 'cattery-owner',
        isVerified: waitlistUser.is_verified, // Use actual verification status from database
        quizCompleted: false,
        waitlistPosition: waitlistUser.waitlist_position
      });
      
      // Track successful form submission
      trackFormSubmission('waitlist_registration', true);
      
      // Show success message before redirecting
      setErrors({ 
        success: 'Registration successful! You will see your verification code on the next page.' 
      });
      
      // Delay navigation to show success message
      setTimeout(() => {
        setCurrentStep('verification');
      }, 2000);
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
            <span className="font-manrope">Back to Landing Page</span>
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

            {/* Cattery Name Input */}
            <div>
              <label htmlFor="catteryName" className="block font-manrope font-medium text-white mb-2">
                Cattery Name
              </label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  id="catteryName"
                  value={formData.catteryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, catteryName: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-manrope"
                  placeholder="Enter your cattery name"
                />
              </div>
              {errors.catteryName && (
                <p className="mt-1 text-sm text-red-400 font-manrope">{errors.catteryName}</p>
              )}
            </div>

            {/* Cattery Owner Benefits - Partner Focus */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-manrope font-semibold text-purple-400 mb-2">
                    🏢 Cattery Partner Benefits
                  </h4>
                  <ul className="font-manrope text-sm text-zinc-300 space-y-1">
                    <li>• <strong>Founding Partner Status</strong> with reduced fees</li>
                    <li>• <strong>Priority placement</strong> in search results</li>
                    <li>• <strong>Business management tools</strong> and analytics</li>
                    <li>• <strong>Direct access to quality cat parents</strong> in your area</li>
                  </ul>
                  <p className="font-manrope text-xs text-purple-300 mt-2">
                    💡 Help us build the perfect platform for cattery businesses
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {errors.success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-manrope text-sm">{errors.success}</p>
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
              Join as a founding cattery partner with exclusive benefits.
              <br />
              <span className="text-purple-300">Unsubscribe anytime • No spam guarantee</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;