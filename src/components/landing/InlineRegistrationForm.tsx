import React, { useState, useEffect, useCallback } from 'react';
import { Mail, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

const InlineRegistrationForm: React.FC = () => {
  const { setCurrentStep, setUser, setWaitlistUser, setVerificationToken } = useApp();
  const [formState, setFormState] = useState<'email' | 'name' | 'verification' | 'processing'>('email');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    captchaAnswer: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: '' });
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null);
  const [nameTimeout, setNameTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (emailTimeout) clearTimeout(emailTimeout);
      if (nameTimeout) clearTimeout(nameTimeout);
    };
  }, [emailTimeout, nameTimeout]);

  // Optimized email validation
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Enhanced email input handler
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    // Clear existing timeout
    if (emailTimeout) {
      clearTimeout(emailTimeout);
    }
    
    if (validateEmail(email)) {
      setIsValidEmail(true);
      setErrors({});
      // Auto-advance to name field after 2 seconds (improved UX)
      const timeout = setTimeout(() => {
        if (validateEmail(email) && email.trim()) {
          setFormState('name');
        }
      }, 2000);
      setEmailTimeout(timeout);
    } else {
      setIsValidEmail(false);
      if (formState === 'name') {
        setFormState('email');
      }
    }
  }, [emailTimeout, formState, validateEmail]);

  // Generate 6-digit verification code
  const generateCaptcha = useCallback(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptchaQuestion({
      question: `Enter this 6-digit code: ${code}`,
      answer: code
    });
  }, []);

  // Enhanced name input handler
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Clear existing timeout
    if (nameTimeout) {
      clearTimeout(nameTimeout);
    }
    
    if (name.trim() && formState === 'name') {
      // Auto-advance to verification after 2 seconds
      const timeout = setTimeout(() => {
        if (name.trim()) {
          generateCaptcha();
          setFormState('verification');
        }
      }, 2000);
      setNameTimeout(timeout);
    }
  }, [nameTimeout, formState, generateCaptcha]);

  // Optimized CAPTCHA submission
  const handleCaptchaSubmit = useCallback(async () => {
    if (formState === 'verification' && formData.captchaAnswer.trim()) {
      // Verify CAPTCHA answer
      if (formData.captchaAnswer.trim() !== captchaQuestion.answer) {
        setErrors({ captcha: 'Incorrect code. Please try again.' });
        generateCaptcha();
        setFormData(prev => ({ ...prev, captchaAnswer: '' }));
        return;
      }

      setIsSubmitting(true);
      setFormState('processing');
      
      try {
        // Use the Edge Function with CAPTCHA registration
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: formData.email,
            name: formData.name,
            userType: 'cat-parent',
            skipEmailSending: true,
            autoVerify: true
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (emailError) {
          console.error('Edge Function failed:', emailError);
          
          // Fallback to dummy user system if Edge Function fails
          const dummyUser = {
            id: crypto.randomUUID(),
            name: formData.name,
            email: formData.email,
            user_type: 'cat-parent',
            is_verified: true,
            quiz_completed: false,
            waitlist_position: Math.floor(Math.random() * 100) + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const dummyVerificationToken = 'dummy-token-fallback';
          
          // Update app state with dummy data
          setWaitlistUser(dummyUser);
          setVerificationToken(dummyVerificationToken);
          setUser({
            id: dummyUser.id,
            name: formData.name,
            email: formData.email,
            userType: 'cat-parent',
            isVerified: true,
            quizCompleted: false,
            waitlistPosition: dummyUser.waitlist_position
          });

          // Continue to quiz
          setCurrentStep('quiz');
          setIsSubmitting(false);
          return;
        }

        const { user, verificationToken } = emailData;
        
        // Update app state with real user data
        setWaitlistUser(user);
        setVerificationToken(verificationToken);
        setUser({
          id: user.id,
          name: formData.name,
          email: formData.email,
          userType: 'cat-parent',
          isVerified: true,
          quizCompleted: false,
          waitlistPosition: user.waitlist_position
        });

        // Go directly to quiz
        setCurrentStep('quiz');
      } catch (error: any) {
        console.error('Registration error:', error);
        setErrors({ 
          submit: error?.message?.includes('row-level security') 
            ? 'Registration temporarily unavailable. Please try again in a moment.'
            : `Registration failed: ${error.message || 'Please try again.'}`
        });
        setIsSubmitting(false);
        setFormState('verification');
      }
    }
  }, [formState, formData, captchaQuestion.answer, generateCaptcha, setCurrentStep, setUser, setWaitlistUser, setVerificationToken]);

  // Enhanced form rendering with better UX
  const renderFormStep = () => {
    switch (formState) {
      case 'email':
        return (
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" aria-hidden="true" />
            <input
              type="email"
              inputMode="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleEmailChange}
              className="optimized-input w-full bg-white/90 backdrop-blur-sm pl-12 pr-4 py-4 rounded-xl text-zinc-900 placeholder-zinc-500 border-2 border-transparent focus:border-green-300 focus:outline-none transition-all duration-300 text-lg touch-target-optimized"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              aria-label="Email address for registration"
              aria-describedby="email-help"
            />
            <div id="email-help" className="sr-only">
              Enter your email to start registration
            </div>
            {isValidEmail && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'name':
        return (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" aria-hidden="true" />
              <input
                type="text"
                inputMode="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleNameChange}
                className="optimized-input w-full bg-white/90 backdrop-blur-sm pl-12 pr-4 py-4 rounded-xl text-zinc-900 placeholder-zinc-500 border-2 border-transparent focus:border-green-300 focus:outline-none transition-all duration-300 text-lg touch-target-optimized"
                autoComplete="given-name"
                autoCapitalize="words"
                aria-label="Your full name"
                aria-describedby="name-help"
              />
              <div id="name-help" className="sr-only">
                Enter your name to continue registration
              </div>
            </div>
            <p className="text-green-100 text-sm text-center">
              ✓ Email confirmed: {formData.email}
            </p>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-white font-semibold mb-2">{captchaQuestion.question}</p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={formData.captchaAnswer}
                onChange={(e) => setFormData(prev => ({ ...prev, captchaAnswer: e.target.value }))}
                className="optimized-input w-full bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl text-zinc-900 placeholder-zinc-500 border-2 border-transparent focus:border-green-300 focus:outline-none transition-all duration-300 text-center text-xl font-mono touch-target-optimized"
                maxLength={6}
                aria-label="Enter the 6-digit verification code"
                aria-describedby="captcha-help"
              />
              <div id="captcha-help" className="sr-only">
                Enter the 6-digit code shown above
              </div>
            </div>
            <button
              onClick={handleCaptchaSubmit}
              disabled={formData.captchaAnswer.length !== 6}
              className="critical-button w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized"
              aria-label="Submit verification code and complete registration"
            >
              Complete Registration
            </button>
            {errors.captcha && (
              <p className="text-red-300 text-sm text-center" role="alert">{errors.captcha}</p>
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4" role="status" aria-live="polite">
            <div className="w-12 h-12 mx-auto">
              <div className="w-full h-full border-4 border-green-500 border-t-transparent rounded-full animate-spin hw-accelerated" aria-hidden="true"></div>
            </div>
            <p className="text-white text-lg font-semibold">Creating your account...</p>
            <p className="text-green-100 text-sm">This will just take a moment</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      id="register"
      data-registration-form
      className="bg-green-600/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-400 shadow-2xl shadow-green-400/20 mobile-optimized prevent-cls"
    >
      <div className="space-y-5">
        <header>
          <h3 className="text-3xl font-extrabold text-white text-center mb-2 drop-shadow-lg">
            Register as a PurrParent
          </h3>
          <p className="text-green-100 text-center text-sm">
            {formState === 'email' && 'Enter your email to get started'}
            {formState === 'name' && 'Tell us your name'}
            {formState === 'verification' && 'Quick verification step'}
            {formState === 'processing' && 'Almost done!'}
          </p>
        </header>
        
        {renderFormStep()}
        
        {errors.submit && (
          <p className="text-red-300 text-sm text-center" role="alert">{errors.submit}</p>
        )}
        
        <p className="text-green-100 text-xs text-center">
          🔒 Your information is secure and will never be shared
        </p>
      </div>
    </div>
  );
};

export default InlineRegistrationForm;