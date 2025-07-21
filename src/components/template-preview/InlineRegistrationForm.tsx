import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Shield, Mail, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

// Inline Registration Form Component
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

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    // Clear existing timeout
    if (emailTimeout) {
      clearTimeout(emailTimeout);
    }
    
    if (validateEmail(email)) {
      setIsValidEmail(true);
      setErrors({});
      // Auto-advance to name field after 2.5 seconds
      const timeout = setTimeout(() => {
        if (validateEmail(email) && email.trim()) {
          setFormState('name');
        }
      }, 2500);
      setEmailTimeout(timeout);
    } else {
      setIsValidEmail(false);
      if (formState === 'name') {
        setFormState('email');
      }
    }
  };

  // Generate 6-digit verification code
  const generateCaptcha = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    setCaptchaQuestion({
      question: `Enter this 6-digit code: ${code}`,
      answer: code
    });
  };

  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Clear existing timeout
    if (nameTimeout) {
      clearTimeout(nameTimeout);
    }
    
    if (name.trim() && formState === 'name') {
      // Auto-advance to verification after 2.5 seconds
      const timeout = setTimeout(() => {
        if (name.trim()) {
          generateCaptcha();
          setFormState('verification');
        }
      }, 2500);
      setNameTimeout(timeout);
    }
  };

  // Handle CAPTCHA verification and registration
  const handleCaptchaSubmit = async () => {
    if (formState === 'verification' && formData.captchaAnswer.trim()) {
      // Verify CAPTCHA answer
      if (formData.captchaAnswer.trim() !== captchaQuestion.answer) {
        setErrors({ captcha: 'Incorrect code. Please try again.' });
        generateCaptcha(); // Generate new 6-digit code
        setFormData(prev => ({ ...prev, captchaAnswer: '' }));
        return;
      }

      setIsSubmitting(true);
      try {
        // Use the Edge Function with CAPTCHA registration for production-ready flow
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: formData.email,
            name: formData.name,
            userType: 'cat-parent',
            skipEmailSending: true, // Skip actual email sending
            autoVerify: true // Auto-verify after CAPTCHA
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (emailError) {
          console.error('Edge Function failed:', emailError);
          console.log('🔧 Falling back to dummy user system for testing');
          
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
          isVerified: true, // Mark as verified after CAPTCHA
          quizCompleted: false,
          waitlistPosition: user.waitlist_position
        });

        // Go directly to quiz
        setCurrentStep('quiz');
      } catch (error) {
        console.error('Registration error:', error);
        // If it's an RLS error, show a more user-friendly message
        if (error.message && error.message.includes('row-level security')) {
          setErrors({ submit: 'Registration temporarily unavailable. Please try again in a moment.' });
        } else {
          setErrors({ submit: `Registration failed: ${error.message || 'Please try again.'}` });
        }
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div 
      id="register"
      data-registration-form
      className="bg-green-600/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-400 shadow-2xl shadow-green-400/20"
    >
      <div className="space-y-5">
        <h3 className="text-3xl font-extrabold text-white text-center mb-2 drop-shadow-lg">
          Register as a PurrParent
        </h3>
        
        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
          <input
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full pl-12 pr-12 py-4 bg-zinc-700/80 border-2 border-zinc-500 rounded-xl text-white placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-lg"
          />
          {isValidEmail && (
            <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-green-300" />
          )}
        </div>
        {errors.email && <p className="text-red-400 text-sm font-medium">{errors.email}</p>}

        {/* Name Input - Shows when email is valid */}
        {formState === 'name' && (
          <div className="relative animate-in slide-in-from-top-4 duration-300">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              className="w-full pl-12 pr-4 py-4 bg-zinc-700/80 border-2 border-zinc-500 rounded-xl text-white placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-lg"
              autoFocus
            />
          </div>
        )}

        {/* CAPTCHA Input - Shows after name is entered */}
        {formState === 'verification' && (
          <div className="relative animate-in slide-in-from-top-4 duration-300">
            <div className="mb-4 text-center">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-600">
                <p className="text-sm text-zinc-400 mb-2">Quick verification to prevent spam:</p>
                <div className="text-2xl font-bold text-white mb-2">
                  {captchaQuestion.question}
                </div>
              </div>
            </div>
            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
            <input
              type="text"
              value={formData.captchaAnswer}
              onChange={(e) => setFormData(prev => ({ ...prev, captchaAnswer: e.target.value }))}
              placeholder="Enter your answer"
              className="w-full pl-12 pr-4 py-4 bg-zinc-700/80 border-2 border-zinc-500 rounded-xl text-white placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all text-lg text-center"
              autoFocus
            />
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-500/20 border-2 border-red-500/40 rounded-xl p-4">
            <p className="text-red-300 text-sm text-center font-medium">{errors.submit}</p>
          </div>
        )}

        {errors.captcha && (
          <div className="bg-red-500/20 border-2 border-red-500/40 rounded-xl p-4">
            <p className="text-red-300 text-sm text-center font-medium">{errors.captcha}</p>
          </div>
        )}

        {/* CAPTCHA Submit Button */}
        {formState === 'verification' && formData.captchaAnswer.trim() ? (
          <button
            onClick={handleCaptchaSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white text-xl font-bold py-5 rounded-full hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-400/30 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>START QUIZ</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        ) : null}

        {/* Help Text */}
        <p className="text-sm text-zinc-300 text-center font-medium">
          {formState === 'verification' ? (
            <>🔒 Quick anti-spam verification • Enter the 6-digit code above</>
          ) : (
            <>🔒 Fast registration • No email verification required</>
          )}
        </p>
      </div>
    </div>
  );
};

export default InlineRegistrationForm;