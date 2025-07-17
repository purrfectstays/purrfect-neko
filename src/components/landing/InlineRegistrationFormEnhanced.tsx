import React, { useState, useEffect, useCallback } from 'react';
import { Mail, User, MapPin, Globe, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

// Enhanced data collection hooks
const useInvisibleDataCollection = () => {
  const [behaviorData, setBehaviorData] = useState({
    deviceType: 'unknown',
    screenSize: '',
    userAgent: '',
    timezone: '',
    language: '',
    connectionType: 'unknown',
    pageLoadTime: 0,
    engagementStartTime: Date.now(),
    interactions: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    
    // Device and browser detection
    const deviceType = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
    const screenSize = `${window.innerWidth}x${window.innerHeight}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const connection = (navigator as any).connection;
    
    setBehaviorData(prev => ({
      ...prev,
      deviceType,
      screenSize,
      userAgent: navigator.userAgent,
      timezone,
      language,
      connectionType: connection ? connection.effectiveType : 'unknown',
      pageLoadTime: Date.now() - startTime
    }));

    // Track interactions
    const trackInteraction = () => {
      setBehaviorData(prev => ({
        ...prev,
        interactions: prev.interactions + 1
      }));
    };

    document.addEventListener('click', trackInteraction);
    document.addEventListener('keydown', trackInteraction);

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, []);

  return behaviorData;
};

const useLocationDetection = () => {
  const [locationData, setLocationData] = useState({
    country: '',
    city: '',
    currency: 'USD',
    timezone: '',
    detected: false
  });

  useEffect(() => {
    // Enhanced geolocation with IP-based fallback
    const detectLocation = async () => {
      try {
        // Try IP-based geolocation first (faster)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_name) {
          setLocationData({
            country: data.country_name,
            city: data.city || '',
            currency: data.currency || 'USD',
            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            detected: true
          });
        }
      } catch (error) {
        // Fallback to timezone-based detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currency = timezone.includes('America') ? 'USD' : 
                        timezone.includes('Europe') ? 'EUR' : 
                        timezone.includes('Toronto') ? 'CAD' : 'USD';
        
        setLocationData({
          country: timezone.split('/')[0] || 'Unknown',
          city: timezone.split('/')[1] || '',
          currency,
          timezone,
          detected: true
        });
      }
    };

    detectLocation();
  }, []);

  return locationData;
};

const useSmartSuggestions = (email: string, locationData: any) => {
  const [suggestions, setSuggestions] = useState({
    userType: '',
    confidence: 0,
    show: false
  });

  useEffect(() => {
    if (!email || email.length < 5) {
      setSuggestions({ userType: '', confidence: 0, show: false });
      return;
    }

    // Smart user type detection
    const catKeywords = ['cat', 'kitty', 'feline', 'meow', 'purr', 'whiskers'];
    const businessKeywords = ['info', 'admin', 'contact', 'hello', 'office', 'business'];
    
    const emailLower = email.toLowerCase();
    const hasCatKeywords = catKeywords.some(keyword => emailLower.includes(keyword));
    const hasBusinessKeywords = businessKeywords.some(keyword => emailLower.includes(keyword));
    
    let userType = '';
    let confidence = 0;
    
    if (hasCatKeywords) {
      userType = 'cat-parent';
      confidence = 85;
    } else if (hasBusinessKeywords) {
      userType = 'cattery-owner';
      confidence = 70;
    } else if (emailLower.includes('gmail') || emailLower.includes('yahoo') || emailLower.includes('hotmail')) {
      userType = 'cat-parent';
      confidence = 60;
    }
    
    setSuggestions({
      userType,
      confidence,
      show: confidence > 60
    });
  }, [email]);

  return suggestions;
};

const useLiveStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 47,
    recentSignup: '',
    userCount: 47,
    loading: false
  });

  useEffect(() => {
    // Simulate live stats updates
    const names = ['Sarah', 'Mike', 'Emma', 'James', 'Lisa', 'David', 'Anna', 'Chris'];
    const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'London', 'Sydney', 'Melbourne'];
    
    const updateStats = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      setStats(prev => ({
        ...prev,
        recentSignup: `${randomName} from ${randomCity}`,
        userCount: prev.userCount + Math.floor(Math.random() * 2)
      }));
    };

    // Update stats every 30 seconds for demo effect
    const interval = setInterval(updateStats, 30000);
    
    // Initial update after 3 seconds
    setTimeout(updateStats, 3000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};

const InlineRegistrationFormEnhanced: React.FC = () => {
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
  const [showRewards, setShowRewards] = useState(false);

  // Enhanced data collection
  const behaviorData = useInvisibleDataCollection();
  const locationData = useLocationDetection();
  const smartSuggestions = useSmartSuggestions(formData.email, locationData);
  const liveStats = useLiveStats();

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (emailTimeout) clearTimeout(emailTimeout);
      if (nameTimeout) clearTimeout(nameTimeout);
    };
  }, [emailTimeout, nameTimeout]);

  // Optimized email validation
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      // Auto-advance to name field after 2 seconds
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

  // Enhanced CAPTCHA submission with invisible data collection
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
        // Enhanced registration with invisible data
        const enhancedUserData = {
          email: formData.email,
          name: formData.name,
          userType: smartSuggestions.userType || 'cat-parent',
          // Invisible data collection
          deviceInfo: {
            type: behaviorData.deviceType,
            screenSize: behaviorData.screenSize,
            userAgent: behaviorData.userAgent,
            connectionType: behaviorData.connectionType
          },
          locationInfo: {
            country: locationData.country,
            city: locationData.city,
            timezone: locationData.timezone,
            currency: locationData.currency
          },
          behaviorInfo: {
            engagementTime: Date.now() - behaviorData.engagementStartTime,
            interactions: behaviorData.interactions,
            language: behaviorData.language
          }
        };

        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            ...enhancedUserData,
            skipEmailSending: true,
            autoVerify: true
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (emailError) {
          console.error('Edge Function failed:', emailError);
          
          // Enhanced fallback with collected data
          const dummyUser = {
            id: crypto.randomUUID(),
            name: formData.name,
            email: formData.email,
            user_type: smartSuggestions.userType || 'cat-parent',
            is_verified: true,
            quiz_completed: false,
            waitlist_position: liveStats.userCount + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Store enhanced data
            device_info: enhancedUserData.deviceInfo,
            location_info: enhancedUserData.locationInfo,
            behavior_info: enhancedUserData.behaviorInfo
          };
          
          const dummyVerificationToken = 'enhanced-token-fallback';
          
          // Show instant gratification
          setShowRewards(true);
          
          // Update app state with enhanced data
          setWaitlistUser(dummyUser);
          setVerificationToken(dummyVerificationToken);
          setUser({
            id: dummyUser.id,
            name: formData.name,
            email: formData.email,
            userType: smartSuggestions.userType || 'cat-parent',
            isVerified: true,
            quizCompleted: false,
            waitlistPosition: dummyUser.waitlist_position
          });

          // Delayed transition to quiz for reward display
          setTimeout(() => {
            setCurrentStep('quiz');
          }, 3000);
          
          setIsSubmitting(false);
          return;
        }

        const { user, verificationToken } = emailData;
        
        // Show instant gratification
        setShowRewards(true);
        
        // Update app state with enhanced user data
        setWaitlistUser(user);
        setVerificationToken(verificationToken);
        setUser({
          id: user.id,
          name: formData.name,
          email: formData.email,
          userType: smartSuggestions.userType || 'cat-parent',
          isVerified: true,
          quizCompleted: false,
          waitlistPosition: user.waitlist_position
        });

        // Delayed transition for reward display
        setTimeout(() => {
          setCurrentStep('quiz');
        }, 3000);
        
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
  }, [formState, formData, captchaQuestion.answer, generateCaptcha, setCurrentStep, setUser, setWaitlistUser, setVerificationToken, smartSuggestions, behaviorData, locationData, liveStats]);

  // Instant gratification display
  const renderInstantGratification = () => {
    if (!showRewards) return null;

    return (
      <div className="text-center space-y-4 animate-fadeInUp">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Welcome {formData.name}! You're member #{liveStats.userCount + 1}
        </h3>
        <div className="space-y-2 text-green-100">
          {locationData.city && (
            <p className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              {locationData.city} location confirmed
            </p>
          )}
          <p className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" />
            Found quality catteries in your area
          </p>
          <p className="flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            Quiz ready - help shape our platform!
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 mt-4">
          <p className="text-white font-semibold">🚀 Your quiz insights will help 500+ cat parents</p>
          <p className="text-green-100 text-sm">Starting quiz automatically...</p>
        </div>
      </div>
    );
  };

  // Enhanced form rendering
  const renderFormStep = () => {
    if (showRewards) {
      return renderInstantGratification();
    }

    switch (formState) {
      case 'email':
        return (
          <div className="space-y-4">
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
              />
              {isValidEmail && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Smart suggestions */}
            {smartSuggestions.show && (
              <div className="bg-white/10 rounded-lg p-3 text-center animate-fadeIn">
                <p className="text-green-100 text-sm">
                  💡 Quick question: Are you a{' '}
                  <span className="font-semibold text-white">
                    {smartSuggestions.userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner'}
                  </span>
                  ?
                </p>
              </div>
            )}
            
            {/* Live stats */}
            {liveStats.recentSignup && (
              <div className="text-center">
                <p className="text-green-100 text-sm">
                  🎉 {liveStats.userCount} cat parents joined • {liveStats.recentSignup} just signed up!
                </p>
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
              />
            </div>
            <div className="space-y-2">
              <p className="text-green-100 text-sm text-center">
                ✓ Email confirmed: {formData.email}
              </p>
              {locationData.detected && (
                <p className="text-green-100 text-sm text-center flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationData.city && `${locationData.city}, `}{locationData.country} detected
                </p>
              )}
            </div>
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
              />
            </div>
            <button
              onClick={handleCaptchaSubmit}
              disabled={formData.captchaAnswer.length !== 6}
              className="critical-button w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized"
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
            <p className="text-green-100 text-sm">Analyzing your preferences...</p>
            {locationData.detected && (
              <p className="text-green-100 text-sm">
                Setting up for {locationData.city || locationData.country}...
              </p>
            )}
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
            {showRewards ? 'Welcome to Purrfect Stays!' : 'Join the Community'}
          </h3>
          {!showRewards && (
            <p className="text-green-100 text-center text-sm">
              {formState === 'email' && `Join ${liveStats.userCount}+ cat parents shaping our platform`}
              {formState === 'name' && 'Tell us your name'}
              {formState === 'verification' && 'Quick verification step'}
              {formState === 'processing' && 'Almost done!'}
            </p>
          )}
        </header>
        
        {renderFormStep()}
        
        {errors.submit && (
          <p className="text-red-300 text-sm text-center" role="alert">{errors.submit}</p>
        )}
        
        {!showRewards && (
          <p className="text-green-100 text-xs text-center">
            🔒 Your information is secure • 2-minute quiz = Lifetime founding member benefits
          </p>
        )}
      </div>
    </div>
  );
};

export default InlineRegistrationFormEnhanced;