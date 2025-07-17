import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, MapPin, DollarSign } from 'lucide-react';
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
}

const MobileRapidFlow: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setCurrentStep } = useApp();
  const [flowState, setFlowState] = useState<RapidFlowState>({
    currentStep: 0,
    email: '',
    name: '',
    userType: '',
    quizAnswers: {},
    isSubmitting: false,
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Track funnel entry
  useEffect(() => {
    analytics.trackFunnelStep('rapid_flow_start');
    analytics.trackRegistrationStart();
    
    // Auto-focus email input
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 300);

    // Start background location detection
    GeolocationService.getUserLocation()
      .then(location => {
        setFlowState(prev => ({ ...prev, location }));
      })
      .catch(() => {
        // Silent fail - location is nice to have
      });
  }, []);

  // Email validation and auto-advance
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Auto-advance logic
  const handleEmailChange = (email: string) => {
    setFlowState(prev => ({ ...prev, email }));
    
    if (validateEmail(email)) {
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Auto-advance after brief delay
      setTimeout(() => {
        if (flowState.name.trim()) {
          advanceStep();
        } else {
          nameInputRef.current?.focus();
        }
      }, 800);
    }
  };

  const handleNameChange = (name: string) => {
    setFlowState(prev => ({ ...prev, name }));
    
    if (name.trim().length >= 2 && validateEmail(flowState.email)) {
      setTimeout(() => {
        advanceStep();
      }, 600);
    }
  };

  const advanceStep = () => {
    setFlowState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    analytics.trackFunnelStep(`rapid_step_${flowState.currentStep + 1}`);
  };

  const selectUserType = (userType: 'cat-parent' | 'cattery-owner') => {
    setFlowState(prev => ({ ...prev, userType }));
    analytics.trackEvent('user_type_selected', 'registration', userType);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    setTimeout(advanceStep, 400);
  };

  const handleQuizAnswer = (questionId: string, answer: any) => {
    setFlowState(prev => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: answer }
    }));

    // Track individual answers
    analytics.trackQuizResponse(questionId, answer, flowState.userType, Object.keys(flowState.quizAnswers).length);

    // Auto-advance if this was the last question
    const totalQuestions = 3;
    const answeredQuestions = Object.keys(flowState.quizAnswers).length + 1;
    
    if (answeredQuestions >= totalQuestions) {
      setTimeout(() => {
        handleSubmit();
      }, 600);
    }
  };

  const handleSubmit = async () => {
    setFlowState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
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

      // Track successful conversion
      analytics.trackRegistrationComplete(flowState.userType, result.waitlistPosition);
      analytics.trackQuizComplete(flowState.userType, result.waitlistPosition);
      analytics.trackConversion('rapid_flow_complete', {
        user_type: flowState.userType,
        waitlist_position: result.waitlistPosition,
        completion_time: Date.now()
      });

    } catch (error) {
      console.error('Rapid flow submission failed:', error);
      setFlowState(prev => ({ ...prev, isSubmitting: false }));
      
      // Show error and fallback
      alert('Something went wrong. Please try again.');
    }
  };

  // Progress indicator
  const ProgressIndicator = () => {
    const steps = ['Email', 'Type', 'Quiz', 'Success'];
    const progress = (flowState.currentStep / (steps.length - 1)) * 100;
    
    return (
      <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-4">
        <div className="flex justify-center items-center space-x-2 mb-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= flowState.currentStep 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                  : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Step 0: Email & Name Capture
  const EmailCapture = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Join <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text">1,247</span> cat parents
        </h1>
        <p className="text-lg text-slate-300">Get early access to premium catteries</p>
      </div>

      <div className="space-y-4">
        <input
          ref={emailInputRef}
          type="email"
          placeholder="your@email.com"
          value={flowState.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          autoComplete="email"
        />
        
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Your name"
          value={flowState.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          autoComplete="name"
        />
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-4">
        <p className="text-sm text-slate-400 flex items-center justify-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          "Finally, stress-free cat care!" - Sarah M.
        </p>
      </div>
    </div>
  );

  // Step 1: User Type Selection
  const UserTypeSelect = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white">I am a...</h2>
        <p className="text-slate-300">Choose what describes you best</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => selectUserType('cat-parent')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🐱</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cat Parent</h3>
              <p className="text-slate-400 group-hover:text-slate-300">Find trusted catteries nearby</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
          </div>
        </button>

        <button
          onClick={() => selectUserType('cattery-owner')}
          className="w-full p-6 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-indigo-800 hover:to-purple-800 border border-zinc-600 rounded-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🏠</div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">Cattery Owner</h3>
              <p className="text-slate-400 group-hover:text-slate-300">Grow your cattery business</p>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white" />
          </div>
        </button>
      </div>
    </div>
  );

  // Step 2: Mini Quiz
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
        type: 'budget',
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
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-sm text-indigo-400 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(currentQuestion.id, index)}
              className="w-full p-4 bg-zinc-800 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-purple-800 border border-zinc-700 hover:border-indigo-500 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-3">
                {typeof option === 'object' && option.emoji && (
                  <span className="text-2xl">{option.emoji}</span>
                )}
                <span className="text-white group-hover:text-indigo-300 font-medium">
                  {typeof option === 'string' ? option : option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Success
  const InlineSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-white">You're in!</h2>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4">
          <p className="text-white font-bold text-lg">
            Waitlist Position #{flowState.waitlistPosition}
          </p>
        </div>
      </div>

      <div className="bg-zinc-800/50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">What's next?</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>📧 Welcome package coming your way</p>
          <p>🎯 Early access to premium catteries</p>
          <p>💝 Exclusive founder benefits</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/success')}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Your Benefits
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    if (flowState.isSubmitting) {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white">Processing...</h2>
          <p className="text-slate-300">Securing your spot</p>
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20">
      <ProgressIndicator />
      
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="min-h-[60vh] flex items-center justify-center">
            {renderCurrentStep()}
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default MobileRapidFlow;