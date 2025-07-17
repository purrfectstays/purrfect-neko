import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../lib/analytics';
import { useApp } from '../context/AppContext';
import { UnifiedEmailVerificationService } from '../services/unifiedEmailVerificationService';
import { GeolocationService, LocationData } from '../services/geolocationService';

// Custom optimized SVG icons to reduce bundle size
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const WifiIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <path d="M12 20h.01"/>
  </svg>
);

const WifiOffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="2" y1="2" x2="22" y2="22"/>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
    <path d="M2 8.82a15 15 0 0 1 4.17-2.65"/>
    <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/>
    <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/>
    <path d="M5 13a10 10 0 0 1 5.24-2.76"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

interface RapidFlowState {
  currentStep: number;
  email: string;
  name: string;
  userType: 'cat-parent' | 'cattery-owner' | '';
  quizAnswers: Record<string, any>;
  isSubmitting: boolean;
  location?: LocationData;
  waitlistPosition?: number;
  userEngaged: boolean;
  networkStatus: 'online' | 'offline' | 'slow';
  errors: Record<string, string>;
}

interface ErrorState {
  message: string;
  action: 'retry' | 'continue' | 'fallback';
  canContinueOffline: boolean;
}

const MobileRapidFlowUltra: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [flowState, setFlowState] = useState<RapidFlowState>({
    currentStep: 0,
    email: '',
    name: '',
    userType: '',
    quizAnswers: {},
    isSubmitting: false,
    userEngaged: false,
    networkStatus: 'online',
    errors: {}
  });
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [announcements, setAnnouncements] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance tracking with memoization
  const performanceTracker = useMemo(() => ({
    markStart: (event: string) => {
      if ('performance' in window && performance.mark) {
        performance.mark(`${event}-start`);
      }
    },
    markEnd: (event: string) => {
      if ('performance' in window && performance.mark && performance.measure) {
        performance.mark(`${event}-end`);
        performance.measure(event, `${event}-start`, `${event}-end`);
        const entries = performance.getEntriesByName(event);
        if (entries.length > 0) {
          const duration = entries[0].duration;
          analytics.trackPerformance(`rapid_ultra_${event}`, Math.round(duration));
        }
      }
    }
  }), []);

  // Device detection with memoization
  const isMobileDevice = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
           ('ontouchstart' in window) || 
           (window.innerWidth < 768);
  }, []);

  // Optimized haptic feedback
  const hapticFeedback = useMemo(() => ({
    light: () => navigator.vibrate?.(50),
    success: () => navigator.vibrate?.([100, 50, 100]),
    error: () => navigator.vibrate?.(200),
    selection: () => navigator.vibrate?.(75)
  }), []);

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        setFlowState(prev => ({
          ...prev,
          networkStatus: effectiveType === '2g' || effectiveType === 'slow-2g' ? 'slow' : 'online'
        }));
      }
    };

    const handleOnline = () => setFlowState(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setFlowState(prev => ({ ...prev, networkStatus: 'offline' }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced initialization with performance tracking
  useEffect(() => {
    performanceTracker.markStart('component_init_ultra');
    
    // Track enhanced analytics
    analytics.trackFunnelStep('rapid_ultra_start');
    analytics.trackConversion('mobile_ultra_entry', {
      device_type: isMobileDevice ? 'mobile' : 'desktop',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      network_type: navigator.onLine ? 'online' : 'offline'
    });

    // Conditional auto-focus with accessibility consideration
    if (!isMobileDevice) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }

    performanceTracker.markEnd('component_init_ultra');
  }, [isMobileDevice, performanceTracker]);

  // Enhanced validation with better error handling
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid && email.length > 0) {
      setFlowState(prev => ({
        ...prev,
        errors: { ...prev.errors, email: 'Please enter a valid email address' }
      }));
    } else {
      setFlowState(prev => ({
        ...prev,
        errors: { ...prev.errors, email: '' }
      }));
    }
    
    return isValid;
  }, []);

  const validateName = useCallback((name: string): boolean => {
    const isValid = name.trim().length >= 2;
    
    if (!isValid && name.length > 0) {
      setFlowState(prev => ({
        ...prev,
        errors: { ...prev.errors, name: 'Please enter your name (at least 2 characters)' }
      }));
    } else {
      setFlowState(prev => ({
        ...prev,
        errors: { ...prev.errors, name: '' }
      }));
    }
    
    return isValid;
  }, []);

  // Lazy background services with performance optimization
  const handleFirstInteraction = useCallback(() => {
    if (!flowState.userEngaged) {
      performanceTracker.markStart('background_services_ultra');
      
      setFlowState(prev => ({ ...prev, userEngaged: true }));

      // Optimized location detection
      setTimeout(() => {
        GeolocationService.getUserLocation()
          .then(location => {
            setFlowState(prev => ({ ...prev, location }));
            analytics.trackEvent('location_detected_ultra', 'background', location.country);
          })
          .catch(() => {
            // Silent fail with fallback
          });
      }, 100);

      performanceTracker.markEnd('background_services_ultra');
    }
  }, [flowState.userEngaged, performanceTracker]);

  // Enhanced input handlers with accessibility
  const handleEmailChange = useCallback((email: string) => {
    handleFirstInteraction();
    setFlowState(prev => ({ ...prev, email }));
    
    if (validateEmail(email)) {
      hapticFeedback.light();
      setAnnouncements('Email is valid');
      
      if (flowState.name.trim().length >= 2) {
        setTimeout(() => {
          advanceStep();
        }, 600);
      } else {
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 300);
      }
    }
  }, [flowState.name, hapticFeedback, validateEmail, handleFirstInteraction]);

  const handleNameChange = useCallback((name: string) => {
    setFlowState(prev => ({ ...prev, name }));
    
    if (validateName(name) && validateEmail(flowState.email)) {
      hapticFeedback.light();
      setAnnouncements('Information complete, proceeding to next step');
      setTimeout(() => {
        advanceStep();
      }, 400);
    }
  }, [flowState.email, hapticFeedback, validateEmail, validateName]);

  const advanceStep = useCallback(() => {
    performanceTracker.markStart(`step_ultra_${flowState.currentStep}_to_${flowState.currentStep + 1}`);
    
    setFlowState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    hapticFeedback.selection();
    
    setAnnouncements(`Moved to step ${flowState.currentStep + 2}`);
    
    analytics.trackConversion('mobile_ultra_step_complete', {
      from_step: flowState.currentStep,
      to_step: flowState.currentStep + 1,
      network_type: flowState.networkStatus
    });

    performanceTracker.markEnd(`step_ultra_${flowState.currentStep}_to_${flowState.currentStep + 1}`);
  }, [flowState.currentStep, flowState.networkStatus, hapticFeedback, performanceTracker]);

  const selectUserType = useCallback((userType: 'cat-parent' | 'cattery-owner') => {
    performanceTracker.markStart('user_type_selection_ultra');
    
    setFlowState(prev => ({ ...prev, userType }));
    setAnnouncements(`Selected ${userType.replace('-', ' ')}`);
    
    analytics.trackEvent('user_type_selected_ultra', 'registration', userType);
    hapticFeedback.success();
    
    setTimeout(advanceStep, 300);
    performanceTracker.markEnd('user_type_selection_ultra');
  }, [advanceStep, hapticFeedback, performanceTracker]);

  const handleQuizAnswer = useCallback((questionId: string, answer: any) => {
    setFlowState(prev => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: answer }
    }));

    hapticFeedback.selection();
    setAnnouncements(`Answer recorded for ${questionId}`);
    
    analytics.trackQuizResponse(questionId, answer, flowState.userType, Object.keys(flowState.quizAnswers).length);

    const totalQuestions = 3;
    const answeredQuestions = Object.keys(flowState.quizAnswers).length + 1;
    
    if (answeredQuestions >= totalQuestions) {
      setAnnouncements('Quiz complete, submitting your information');
      setTimeout(() => {
        handleSubmit();
      }, 400);
    }
  }, [flowState.userType, flowState.quizAnswers, hapticFeedback]);

  // Enhanced error handling with offline support
  const handleNetworkError = useCallback((error: any) => {
    localStorage.setItem('rapidFlowUltraBackup', JSON.stringify(flowState));
    hapticFeedback.error();
    
    setErrorState({
      message: flowState.networkStatus === 'offline' 
        ? "You're offline. We'll save your progress!"
        : "Connection issue detected",
      action: 'retry',
      canContinueOffline: true
    });

    analytics.trackError('network_error_ultra', error.message || 'Network failure', 'mobile_rapid_ultra');
  }, [flowState, hapticFeedback]);

  const handleSubmit = useCallback(async () => {
    performanceTracker.markStart('form_submission_ultra');
    setFlowState(prev => ({ ...prev, isSubmitting: true }));
    setAnnouncements('Submitting your registration');
    
    try {
      const { user } = await UnifiedEmailVerificationService.registerUser({
        name: flowState.name,
        email: flowState.email,
        userType: flowState.userType as 'cat-parent' | 'cattery-owner'
      });

      const quizResponses = Object.entries(flowState.quizAnswers).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer.toString()
      }));

      const result = await UnifiedEmailVerificationService.submitQuizResponses(user.id, quizResponses);

      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        isVerified: true,
        quizCompleted: true,
        waitlistPosition: result.waitlistPosition
      });

      setFlowState(prev => ({ 
        ...prev, 
        waitlistPosition: result.waitlistPosition,
        currentStep: prev.currentStep + 1,
        isSubmitting: false 
      }));

      localStorage.removeItem('rapidFlowUltraBackup');
      hapticFeedback.success();
      setAnnouncements(`Registration successful! You're number ${result.waitlistPosition} on the waitlist`);

      analytics.trackConversion('rapid_ultra_complete', {
        user_type: flowState.userType,
        waitlist_position: result.waitlistPosition,
        device_type: isMobileDevice ? 'mobile' : 'desktop',
        network_type: flowState.networkStatus
      });

      performanceTracker.markEnd('form_submission_ultra');

    } catch (error) {
      console.error('Ultra rapid flow submission failed:', error);
      handleNetworkError(error);
      setFlowState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [flowState, hapticFeedback, handleNetworkError, isMobileDevice, performanceTracker, setUser]);

  // Enhanced Touch Button Component with accessibility
  const TouchButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
  }> = ({ children, onClick, className = "", disabled = false, ...ariaProps }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        touch-target-optimized
        focus-visible:focus
        active:scale-95 
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      {...ariaProps}
    >
      {children}
    </button>
  );

  // Network status indicator
  const NetworkIndicator = () => (
    <div className="fixed top-4 right-4 z-50" role="status" aria-live="polite">
      {flowState.networkStatus === 'offline' && (
        <div className="bg-red-500/90 text-white px-2 py-1 rounded text-xs flex items-center">
          <WifiOffIcon aria-hidden="true" />
          <span className="ml-1">Offline</span>
        </div>
      )}
      {flowState.networkStatus === 'slow' && (
        <div className="bg-yellow-500/90 text-white px-2 py-1 rounded text-xs flex items-center">
          <WifiIcon aria-hidden="true" />
          <span className="ml-1">Slow</span>
        </div>
      )}
    </div>
  );

  // Enhanced progress indicator with ARIA
  const ProgressIndicator = () => {
    const steps = ['Email', 'Type', 'Quiz', 'Success'];
    const progress = (flowState.currentStep / (steps.length - 1)) * 100;
    
    return (
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-4 mobile-optimized prevent-cls">
        <div 
          role="progressbar" 
          aria-valuenow={flowState.currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Registration progress: step ${flowState.currentStep + 1} of ${steps.length}`}
        >
          <div className="flex justify-center items-center space-x-3 mb-3">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index <= flowState.currentStep 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-110' 
                      : 'bg-zinc-700'
                  }`}
                  aria-hidden="true"
                />
                <span className={`text-xs mt-1 transition-colors ${
                  index <= flowState.currentStep ? 'text-indigo-400' : 'text-zinc-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  };

  // Step 0: Enhanced Email & Name Capture with accessibility
  const EmailCapture = () => (
    <div className="space-y-6 text-center px-4">
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Join <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text">1,247</span> cat parents
        </h1>
        <p className="text-lg text-slate-300-accessible">Get early access to premium catteries</p>
      </header>

      <form className="space-y-4 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4">
          <legend className="sr-only">Personal Information</legend>
          
          <div className="form-group">
            <label htmlFor="email-input" className="sr-only">
              Email address for early access registration
            </label>
            <input
              id="email-input"
              ref={emailInputRef}
              type="email"
              inputMode="email"
              placeholder="your@email.com"
              value={flowState.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="optimized-input"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              onFocus={handleFirstInteraction}
              aria-describedby="email-help email-error"
              aria-required="true"
              aria-invalid={flowState.errors.email ? 'true' : 'false'}
            />
            <div id="email-help" className="sr-only">
              We'll use this to send you early access updates
            </div>
            {flowState.errors.email && (
              <div id="email-error" className="text-sm text-red-400 mt-1" role="alert">
                {flowState.errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="name-input" className="sr-only">
              Your full name
            </label>
            <input
              id="name-input"
              ref={nameInputRef}
              type="text"
              inputMode="text"
              placeholder="Your name"
              value={flowState.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="optimized-input"
              autoComplete="given-name"
              autoCapitalize="words"
              onFocus={handleFirstInteraction}
              aria-describedby="name-help name-error"
              aria-required="true"
              aria-invalid={flowState.errors.name ? 'true' : 'false'}
            />
            <div id="name-help" className="sr-only">
              Your first name or full name
            </div>
            {flowState.errors.name && (
              <div id="name-error" className="text-sm text-red-400 mt-1" role="alert">
                {flowState.errors.name}
              </div>
            )}
          </div>
        </fieldset>
      </form>

      <div className="bg-zinc-800/50 rounded-xl p-4 max-w-sm mx-auto">
        <p className="text-sm text-slate-400-accessible flex items-center justify-center">
          <StarIcon aria-hidden="true" />
          <span className="ml-1">"Finally, stress-free cat care!" - Sarah M.</span>
        </p>
      </div>
    </div>
  );

  // Step 1: Enhanced User Type Selection with accessibility
  const UserTypeSelect = () => (
    <div className="space-y-6 text-center px-4">
      <header className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white">I am a...</h2>
        <p className="text-slate-300-accessible">Choose what describes you best</p>
      </header>

      <fieldset className="space-y-4 max-w-sm mx-auto">
        <legend className="sr-only">User type selection</legend>
        
        <TouchButton
          onClick={() => selectUserType('cat-parent')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 group"
          aria-label="I am a cat parent looking for trusted catteries"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl" aria-hidden="true">🐱</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cat Parent</h3>
              <p className="text-slate-400-accessible group-hover:text-slate-300 text-sm">Find trusted catteries nearby</p>
            </div>
            <ArrowRightIcon aria-hidden="true" />
          </div>
        </TouchButton>

        <TouchButton
          onClick={() => selectUserType('cattery-owner')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 group"
          aria-label="I am a cattery owner looking to grow my business"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl" aria-hidden="true">🏠</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cattery Owner</h3>
              <p className="text-slate-400-accessible group-hover:text-slate-300 text-sm">Grow your cattery business</p>
            </div>
            <ArrowRightIcon aria-hidden="true" />
          </div>
        </TouchButton>
      </fieldset>

      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        💡 Selection will automatically proceed to the next step
      </p>
    </div>
  );

  // Step 2: Enhanced Mini Quiz with accessibility
  const MiniQuiz = () => {
    const questions = [
      {
        id: 'frequency',
        text: 'How often do you need cattery services?',
        options: ['Monthly', 'Few times/year', 'Rarely', 'Planning ahead']
      },
      {
        id: 'budget',
        text: 'Typical budget per visit?',
        options: ['$50-100', '$100-200', '$200-300', '$300+']
      },
      {
        id: 'priority',
        text: 'Most important to you?',
        options: [
          { emoji: '🛡️', text: 'Safety & Trust' },
          { emoji: '💰', text: 'Best Price' },
          { emoji: '📍', text: 'Nearby Location' },
          { emoji: '⭐', text: 'Reviews & Quality' }
        ]
      }
    ];

    const currentQuestionIndex = Object.keys(flowState.quizAnswers).length;
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
      <div className="space-y-6 text-center px-4">
        <header className="space-y-3">
          <div className="text-sm text-indigo-400 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {currentQuestion.text}
          </h2>
        </header>

        <fieldset className="space-y-3 max-w-sm mx-auto">
          <legend className="sr-only">{currentQuestion.text}</legend>
          
          {currentQuestion.options.map((option, index) => (
            <TouchButton
              key={index}
              onClick={() => handleQuizAnswer(currentQuestion.id, index)}
              className="w-full p-4 bg-zinc-800 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-purple-800 border border-zinc-700 hover:border-indigo-500 rounded-xl transition-all duration-300 group"
              aria-label={typeof option === 'string' ? option : option.text}
            >
              <div className="flex items-center space-x-3">
                {typeof option === 'object' && option.emoji && (
                  <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                )}
                <span className="text-white group-hover:text-indigo-300 font-medium flex-1 text-left">
                  {typeof option === 'string' ? option : option.text}
                </span>
              </div>
            </TouchButton>
          ))}
        </fieldset>

        <p className="text-xs text-slate-500">
          ⚡ Auto-submits on final answer
        </p>
      </div>
    );
  };

  // Step 3: Enhanced Success with accessibility
  const InlineSuccess = () => (
    <div className="space-y-6 text-center px-4">
      <header className="space-y-4">
        <div className="text-6xl animate-bounce" aria-hidden="true">🎉</div>
        <h1 className="text-3xl font-bold text-white">You're in!</h1>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-white font-bold text-lg">
            Waitlist Position #{flowState.waitlistPosition}
          </p>
        </div>
      </header>

      <section className="bg-zinc-800/50 rounded-xl p-6 space-y-4 max-w-sm mx-auto">
        <h2 className="text-lg font-semibold text-white">What's next?</h2>
        <ul className="space-y-2 text-sm text-slate-300-accessible">
          <li>📧 Welcome package coming your way</li>
          <li>🎯 Early access to premium catteries</li>
          <li>💝 Exclusive founder benefits</li>
        </ul>
      </section>

      <TouchButton
        onClick={() => navigate('/success')}
        className="critical-button max-w-sm mx-auto block"
        aria-label="Explore your early access benefits and next steps"
      >
        Explore Your Benefits
      </TouchButton>
    </div>
  );

  const renderCurrentStep = () => {
    if (flowState.isSubmitting) {
      return (
        <div className="text-center space-y-4 px-4" role="status" aria-live="polite">
          <div className="w-16 h-16 mx-auto">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          </div>
          <h2 className="text-xl font-bold text-white">Processing...</h2>
          <p className="text-slate-300-accessible">Securing your spot</p>
          {flowState.networkStatus === 'slow' && (
            <p className="text-yellow-400 text-sm">Slow connection detected - please wait</p>
          )}
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="text-center space-y-4 px-4" role="alert">
          <div className="text-4xl" aria-hidden="true">⚠️</div>
          <h2 className="text-xl font-bold text-white">Oops!</h2>
          <p className="text-slate-300-accessible">{errorState.message}</p>
          <TouchButton
            onClick={() => {
              setErrorState(null);
              if (errorState.action === 'retry') {
                handleSubmit();
              }
            }}
            className="critical-button"
            aria-label={`${errorState.action === 'retry' ? 'Try again' : 'Continue'} with registration`}
          >
            {errorState.action === 'retry' ? 'Try Again' : 'Continue'}
          </TouchButton>
        </div>
      );
    }

    switch (flowState.currentStep) {
      case 0: return <EmailCapture />;
      case 1: return <UserTypeSelect />;
      case 2: return <MiniQuiz />;
      case 3: return <InlineSuccess />;
      default: return <EmailCapture />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20 mobile-optimized hw-accelerated"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcements}
      </div>

      <NetworkIndicator />
      <ProgressIndicator />
      
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="min-h-[60vh] flex items-center justify-center">
            {renderCurrentStep()}
          </div>
        </div>
      </main>

      {/* Optimized background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default MobileRapidFlowUltra;