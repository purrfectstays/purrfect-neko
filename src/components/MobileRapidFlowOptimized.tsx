import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UnifiedEmailVerificationService } from '../services/unifiedEmailVerificationService';
import { GeolocationService, LocationData } from '../services/geolocationService';
import { analytics } from '../lib/analytics';

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
}

interface ErrorState {
  message: string;
  action: 'retry' | 'continue' | 'fallback';
  canContinueOffline: boolean;
}

const MobileRapidFlowOptimized: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setCurrentStep } = useApp();
  const [flowState, setFlowState] = useState<RapidFlowState>({
    currentStep: 0,
    email: '',
    name: '',
    userType: '',
    quizAnswers: {},
    isSubmitting: false,
    userEngaged: false,
    networkStatus: 'online',
  });
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Performance tracking
  const performanceTracker = {
    markStart: (event: string) => {
      if ('performance' in window) {
        performance.mark(`${event}-start`);
      }
    },
    markEnd: (event: string) => {
      if ('performance' in window) {
        performance.mark(`${event}-end`);
        performance.measure(event, `${event}-start`, `${event}-end`);
        const entries = performance.getEntriesByName(event);
        if (entries.length > 0) {
          const duration = entries[0].duration;
          analytics.trackPerformance(`rapid_flow_${event}`, Math.round(duration));
        }
      }
    }
  };

  // Device detection
  const isMobileDevice = useCallback(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
           ('ontouchstart' in window) || 
           (window.innerWidth < 768);
  }, []);

  // Haptic feedback
  const hapticFeedback = {
    light: () => navigator.vibrate?.(50),
    success: () => navigator.vibrate?.([100, 50, 100]),
    error: () => navigator.vibrate?.(200),
    selection: () => navigator.vibrate?.(75)
  };

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

  // Initial setup with performance tracking
  useEffect(() => {
    performanceTracker.markStart('component_init');
    
    analytics.trackFunnelStep('rapid_flow_optimized_start');
    analytics.trackRegistrationStart();
    
    // Track mobile-specific metrics
    const isMobile = isMobileDevice();
    analytics.trackEvent('device_type', 'rapid_flow', isMobile ? 'mobile' : 'desktop');
    analytics.trackConversion('mobile_funnel_entry', {
      device_type: isMobile ? 'mobile' : 'desktop',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      user_agent: navigator.userAgent.substring(0, 100)
    });

    // Conditional auto-focus (desktop only)
    if (!isMobile) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 300);
    }

    performanceTracker.markEnd('component_init');
  }, []);

  // Lazy background services
  const handleFirstInteraction = useCallback(() => {
    if (!flowState.userEngaged) {
      performanceTracker.markStart('background_services');
      
      setFlowState(prev => ({ ...prev, userEngaged: true }));

      // Start background location detection
      GeolocationService.getUserLocation()
        .then(location => {
          setFlowState(prev => ({ ...prev, location }));
          analytics.trackEvent('location_detected', 'background', location.country);
        })
        .catch(() => {
          // Silent fail - location is nice to have
        });

      performanceTracker.markEnd('background_services');
    }
  }, [flowState.userEngaged]);

  // Email validation with performance tracking
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Auto-advance with haptic feedback
  const handleEmailChange = useCallback((email: string) => {
    handleFirstInteraction();
    setFlowState(prev => ({ ...prev, email }));
    
    if (validateEmail(email)) {
      hapticFeedback.light();
      setTimeout(() => {
        if (flowState.name.trim()) {
          advanceStep();
        } else {
          nameInputRef.current?.focus();
        }
      }, 600);
    }
  }, [flowState.name]);

  const handleNameChange = useCallback((name: string) => {
    setFlowState(prev => ({ ...prev, name }));
    
    if (name.trim().length >= 2 && validateEmail(flowState.email)) {
      hapticFeedback.light();
      setTimeout(() => {
        advanceStep();
      }, 400);
    }
  }, [flowState.email]);

  const advanceStep = useCallback(() => {
    performanceTracker.markStart(`step_${flowState.currentStep}_to_${flowState.currentStep + 1}`);
    
    setFlowState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    hapticFeedback.selection();
    
    analytics.trackFunnelStep(`rapid_step_${flowState.currentStep + 1}`);
    analytics.trackConversion('mobile_step_complete', {
      from_step: flowState.currentStep,
      to_step: flowState.currentStep + 1,
      time_spent: Date.now()
    });

    performanceTracker.markEnd(`step_${flowState.currentStep}_to_${flowState.currentStep + 1}`);
  }, [flowState.currentStep]);

  const selectUserType = useCallback((userType: 'cat-parent' | 'cattery-owner') => {
    performanceTracker.markStart('user_type_selection');
    
    setFlowState(prev => ({ ...prev, userType }));
    analytics.trackEvent('user_type_selected', 'registration', userType);
    
    hapticFeedback.success();
    setTimeout(advanceStep, 300);
    
    performanceTracker.markEnd('user_type_selection');
  }, [advanceStep]);

  const handleQuizAnswer = useCallback((questionId: string, answer: any) => {
    setFlowState(prev => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: answer }
    }));

    hapticFeedback.selection();
    
    // Track individual answers with mobile context
    analytics.trackQuizResponse(questionId, answer, flowState.userType, Object.keys(flowState.quizAnswers).length);
    analytics.trackConversion('mobile_quiz_answer', {
      question_id: questionId,
      answer_value: answer,
      user_type: flowState.userType,
      device_type: isMobileDevice() ? 'mobile' : 'desktop'
    });

    // Auto-advance if this was the last question
    const totalQuestions = 3;
    const answeredQuestions = Object.keys(flowState.quizAnswers).length + 1;
    
    if (answeredQuestions >= totalQuestions) {
      setTimeout(() => {
        handleSubmit();
      }, 400);
    }
  }, [flowState.userType, flowState.quizAnswers]);

  // Enhanced error handling with offline support
  const handleNetworkError = useCallback((error: any) => {
    // Store data locally for retry
    localStorage.setItem('rapidFlowBackup', JSON.stringify(flowState));
    
    hapticFeedback.error();
    
    setErrorState({
      message: flowState.networkStatus === 'offline' 
        ? "You're offline. We'll save your progress!"
        : "Connection issue detected",
      action: 'retry',
      canContinueOffline: true
    });

    analytics.trackError('network_error', error.message || 'Network failure', 'mobile_rapid_flow');
  }, [flowState]);

  const handleSubmit = useCallback(async () => {
    performanceTracker.markStart('form_submission');
    setFlowState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Check for offline backup
      const backup = localStorage.getItem('rapidFlowBackup');
      if (backup && flowState.networkStatus === 'offline') {
        throw new Error('Offline mode - will retry when online');
      }

      // Register user
      const { user, verificationToken } = await UnifiedEmailVerificationService.registerUser({
        name: flowState.name,
        email: flowState.email,
        userType: flowState.userType as 'cat-parent' | 'cattery-owner'
      });

      // Submit quiz responses
      const quizResponses = Object.entries(flowState.quizAnswers).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer.toString()
      }));

      const result = await UnifiedEmailVerificationService.submitQuizResponses(user.id, quizResponses);

      // Update app context
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        isVerified: true,
        quizCompleted: true,
        waitlistPosition: result.waitlistPosition
      });

      // Update local state
      setFlowState(prev => ({ 
        ...prev, 
        waitlistPosition: result.waitlistPosition,
        currentStep: prev.currentStep + 1,
        isSubmitting: false 
      }));

      // Clear any stored backup
      localStorage.removeItem('rapidFlowBackup');
      
      hapticFeedback.success();

      // Track successful conversion with mobile metrics
      analytics.trackRegistrationComplete(flowState.userType, result.waitlistPosition);
      analytics.trackQuizComplete(flowState.userType, result.waitlistPosition);
      analytics.trackConversion('rapid_flow_complete_mobile', {
        user_type: flowState.userType,
        waitlist_position: result.waitlistPosition,
        device_type: isMobileDevice() ? 'mobile' : 'desktop',
        network_type: flowState.networkStatus,
        completion_time: Date.now()
      });

      performanceTracker.markEnd('form_submission');

    } catch (error) {
      console.error('Rapid flow submission failed:', error);
      handleNetworkError(error);
      setFlowState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [flowState, handleNetworkError]);

  // Swipe gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && flowState.currentStep < 3) {
      // Swipe left to advance (if possible)
      const canAdvance = (
        (flowState.currentStep === 0 && validateEmail(flowState.email) && flowState.name.trim()) ||
        (flowState.currentStep === 1 && flowState.userType) ||
        (flowState.currentStep === 2)
      );
      
      if (canAdvance) {
        hapticFeedback.light();
        advanceStep();
      }
    }
  }, [touchStart, touchEnd, flowState, advanceStep]);

  // Enhanced Touch Button Component
  const TouchButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  }> = ({ children, onClick, className = "", disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        min-h-[56px] min-w-[56px] 
        p-4 m-2
        active:scale-95 
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {children}
    </button>
  );

  // Network status indicator
  const NetworkIndicator = () => (
    <div className="fixed top-safe-area-inset-top right-4 z-50">
      {flowState.networkStatus === 'offline' && (
        <div className="bg-red-500/90 text-white px-2 py-1 rounded text-xs flex items-center">
          <WifiOff className="w-3 h-3 mr-1" />
          Offline
        </div>
      )}
      {flowState.networkStatus === 'slow' && (
        <div className="bg-yellow-500/90 text-white px-2 py-1 rounded text-xs flex items-center">
          <Wifi className="w-3 h-3 mr-1" />
          Slow
        </div>
      )}
    </div>
  );

  // Progress indicator with enhanced mobile design
  const ProgressIndicator = () => {
    const steps = ['Email', 'Type', 'Quiz', 'Success'];
    const progress = (flowState.currentStep / (steps.length - 1)) * 100;
    
    return (
      <div className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-4 mobile-container">
        <div className="flex justify-center items-center space-x-3 mb-3">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index <= flowState.currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-110' 
                    : 'bg-zinc-700'
                }`}
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
          />
        </div>
      </div>
    );
  };

  // Step 0: Enhanced Email & Name Capture
  const EmailCapture = () => (
    <div className="space-y-6 text-center px-4">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Join <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text">1,247</span> cat parents
        </h1>
        <p className="text-lg text-slate-300">Get early access to premium catteries</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <input
          ref={emailInputRef}
          type="email"
          inputMode="email"
          placeholder="your@email.com"
          value={flowState.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all touch-target"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          onFocus={handleFirstInteraction}
        />
        
        <input
          ref={nameInputRef}
          type="text"
          inputMode="text"
          placeholder="Your name"
          value={flowState.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all touch-target"
          autoComplete="given-name"
          autoCapitalize="words"
          onFocus={handleFirstInteraction}
        />
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-4 max-w-sm mx-auto">
        <p className="text-sm text-slate-400 flex items-center justify-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          "Finally, stress-free cat care!" - Sarah M.
        </p>
      </div>
    </div>
  );

  // Step 1: Enhanced User Type Selection
  const UserTypeSelect = () => (
    <div className="space-y-6 text-center px-4">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white">I am a...</h2>
        <p className="text-slate-300">Choose what describes you best</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <TouchButton
          onClick={() => selectUserType('cat-parent')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🐱</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cat Parent</h3>
              <p className="text-slate-400 group-hover:text-slate-300 text-sm">Find trusted catteries nearby</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
          </div>
        </TouchButton>

        <TouchButton
          onClick={() => selectUserType('cattery-owner')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🏠</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cattery Owner</h3>
              <p className="text-slate-400 group-hover:text-slate-300 text-sm">Grow your cattery business</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
          </div>
        </TouchButton>
      </div>

      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        💡 Swipe left to continue after selection
      </p>
    </div>
  );

  // Step 2: Enhanced Mini Quiz
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
        <div className="space-y-3">
          <div className="text-sm text-indigo-400 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          {currentQuestion.options.map((option, index) => (
            <TouchButton
              key={index}
              onClick={() => handleQuizAnswer(currentQuestion.id, index)}
              className="w-full p-4 bg-zinc-800 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-purple-800 border border-zinc-700 hover:border-indigo-500 rounded-xl transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                {typeof option === 'object' && option.emoji && (
                  <span className="text-2xl">{option.emoji}</span>
                )}
                <span className="text-white group-hover:text-indigo-300 font-medium flex-1 text-left">
                  {typeof option === 'string' ? option : option.text}
                </span>
              </div>
            </TouchButton>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          ⚡ Auto-submits on final answer
        </p>
      </div>
    );
  };

  // Step 3: Enhanced Success
  const InlineSuccess = () => (
    <div className="space-y-6 text-center px-4">
      <div className="space-y-4">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-white">You're in!</h2>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-white font-bold text-lg">
            Waitlist Position #{flowState.waitlistPosition}
          </p>
        </div>
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-6 space-y-4 max-w-sm mx-auto">
        <h3 className="text-lg font-semibold text-white">What's next?</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>📧 Welcome package coming your way</p>
          <p>🎯 Early access to premium catteries</p>
          <p>💝 Exclusive founder benefits</p>
        </div>
      </div>

      <TouchButton
        onClick={() => navigate('/success')}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 max-w-sm mx-auto block"
      >
        Explore Your Benefits
      </TouchButton>
    </div>
  );

  const renderCurrentStep = () => {
    if (flowState.isSubmitting) {
      return (
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 mx-auto">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white">Processing...</h2>
          <p className="text-slate-300">Securing your spot</p>
          {flowState.networkStatus === 'slow' && (
            <p className="text-yellow-400 text-sm">Slow connection detected - please wait</p>
          )}
        </div>
      );
    }

    if (errorState) {
      return (
        <div className="text-center space-y-4 px-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Oops!</h2>
          <p className="text-slate-300">{errorState.message}</p>
          <TouchButton
            onClick={() => {
              setErrorState(null);
              if (errorState.action === 'retry') {
                handleSubmit();
              }
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
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
      className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20 mobile-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <NetworkIndicator />
      <ProgressIndicator />
      
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="min-h-[60vh] flex items-center justify-center">
            {renderCurrentStep()}
          </div>
        </div>
      </div>

      {/* Background elements with reduced complexity for performance */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default MobileRapidFlowOptimized;