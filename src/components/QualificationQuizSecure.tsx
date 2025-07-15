import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getQuizQuestionsForUser, calculateQuizScore, QuizQuestion } from '../data/quizQuestions';
import { LocalizedQuizService } from '../services/localizedQuizService';
import { GeolocationService, LocationData } from '../services/geolocationService';
import UnifiedEmailVerificationService from '../services/unifiedEmailVerificationService';
import CurrencyIndicator from './CurrencyIndicator';
import { analytics } from '../lib/analytics';
import { rateLimiter, RateLimiter } from '../lib/rateLimiter';

const QualificationQuizSecure: React.FC = () => {
  const navigate = useNavigate();
  const { user, setCurrentStep, setUser } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    // Check if user exists in context, if not check localStorage
    if (!user) {
      const storedUser = localStorage.getItem('purrfect_verified_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Verify the user data is valid and verified
          if (userData && userData.isVerified && userData.id && userData.email) {
            setUser(userData);
            console.log('✅ Loaded verified user from localStorage:', userData);
          } else {
            console.warn('⚠️ Invalid or unverified user data in localStorage, clearing...');
            localStorage.removeItem('purrfect_verified_user');
          }
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('purrfect_verified_user');
        }
      }
    }
    setIsLoadingUser(false);
  }, [user, setUser]);

  useEffect(() => {
    const loadLocalizedQuestions = async () => {
      if (user?.userType) {
        setIsLoadingQuestions(true);
        try {
          // Get user location
          const userLocation = await GeolocationService.getUserLocation();
          setLocation(userLocation);
          
          // Preload currency rates for better performance
          await LocalizedQuizService.preloadCurrencyRates();
          
          // Get localized questions
          const localizedQuestions = await LocalizedQuizService.getLocalizedQuestions(
            user.userType, 
            userLocation
          );
          
          setQuestions(localizedQuestions);
          console.log('✅ Loaded localized quiz questions for:', userLocation.country);
        } catch (error) {
          console.warn('Failed to load localized questions, using default:', error);
          // Fallback to original questions
          const userQuestions = getQuizQuestionsForUser(user.userType);
          setQuestions(userQuestions);
        } finally {
          setIsLoadingQuestions(false);
        }
      }
    };

    loadLocalizedQuestions();
  }, [user]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading Quiz</h2>
          <p>Please wait while we prepare your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isVerified) {
    console.log('🚫 Quiz access denied. User data:', user);
    console.log('🔍 User verification status:', user?.isVerified);
    console.log('🔍 LocalStorage data:', localStorage.getItem('purrfect_verified_user'));
    
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">Please verify your email to access the qualification quiz.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    // Track detailed quiz response for market research
    const responseValue = currentQuestion.type === 'multiple-choice' && currentQuestion.options 
      ? currentQuestion.options[value] 
      : value;
    
    analytics.trackQuizResponse(
      currentQuestion.id,
      responseValue,
      user?.userType || 'unknown',
      currentQuestionIndex
    );

    // Track specific business intelligence insights
    if (currentQuestion.id === 'pricing-tier-preference') {
      analytics.trackPricingPreference(
        user?.userType || 'unknown',
        currentQuestion.options?.[value] || 'unknown'
      );
    }

    if (currentQuestion.id === 'budget' || currentQuestion.id === 'marketing-spend') {
      const budgetRange = currentQuestion.options?.[value] || 'unknown';
      analytics.trackRevenueOpportunity(
        user?.userType || 'unknown',
        budgetRange,
        0 // Will be calculated based on budget range
      );
    }

    if (currentQuestion.id === 'challenge' || currentQuestion.id === 'main-challenge') {
      const painPoint = currentQuestion.options?.[value] || 'unknown';
      analytics.trackCompetitiveInsight(
        'existing_solutions',
        painPoint,
        user?.userType || 'unknown'
      );
    }
  };

  const handleRangeAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    // Track range responses for market research
    analytics.trackQuizResponse(
      currentQuestion.id,
      value,
      user?.userType || 'unknown',
      currentQuestionIndex
    );

    // Track feature interest for product development
    if (currentQuestion.id === 'feature-interest') {
      analytics.trackFeatureDemand(
        'premium_business_features',
        value,
        user?.userType || 'unknown'
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🎯 Quiz submission started...');
    
    if (!user?.id) {
      console.error('❌ No user ID found');
      alert('User session not found. Please refresh the page and try again.');
      return;
    }
    
    console.log('✅ User ID found:', user.id);
    console.log('📋 Quiz answers:', answers);
    
    // Rate limiting check (bypass in development)
    const isDevelopment = import.meta.env.DEV;
    const clientId = RateLimiter.getClientIdentifier();
    const rateLimitResult = rateLimiter.isAllowed(clientId, 'quiz_submission');
    
    if (!rateLimitResult.allowed && !isDevelopment) {
      const minutes = Math.ceil((rateLimitResult.retryAfter || 0) / 60);
      console.warn('🚫 Rate limited');
      alert(`Too many quiz submission attempts. Please try again in ${minutes} minutes.`);
      return;
    }
    
    if (isDevelopment && !rateLimitResult.allowed) {
      console.log('🛠️ Development mode: Bypassing rate limit');
    }
    
    setIsSubmitting(true);
    try {
      console.log('📊 Calculating quiz score...');
      // Calculate score
      calculateQuizScore(answers, user.userType);
      
      // Convert answers to the format expected by the API
      const quizResponses = Object.entries(answers).map(([questionId, answerIndex]) => ({
        question_id: questionId,
        answer: answerIndex.toString()
      }));

      console.log('📤 Submitting quiz responses:', quizResponses);
      console.log('👤 Using user ID:', user.id, 'for email:', user.email);
      
      // Check if we're using dummy user system (no real database interaction)
      const isDummyUser = verificationToken === 'dummy-token';
      
      let result;
      if (isDummyUser) {
        console.log('🔧 Using dummy user system - bypassing database');
        // Simulate successful quiz submission for dummy users
        const randomPosition = Math.floor(Math.random() * 50) + 1; // Random position 1-50
        result = {
          user: {
            ...waitlistUser,
            quiz_completed: true,
            waitlist_position: randomPosition
          },
          waitlistPosition: randomPosition
        };
      } else {
        // Submit quiz responses for real users
        result = await UnifiedEmailVerificationService.submitQuizResponses(user.id, quizResponses);
      }
      
      console.log('✅ Quiz submission successful:', result);
      
      // Update user state
      const updatedUser = {
        ...user,
        quizCompleted: true,
        waitlistPosition: result.waitlistPosition
      };
      console.log('👤 Updating user state:', updatedUser);
      setUser(updatedUser);

      // Clean up localStorage since quiz is completed
      localStorage.removeItem('purrfect_verified_user');

      console.log('🎉 Navigating to success page...');
      // Proceed to success page
      navigate('/success');
      console.log('✅ Navigation completed');
    } catch (error) {
      console.error('❌ Quiz submission failed:', error);
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Quiz submission failed: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
      } else {
        alert('Quiz submission failed. Please try again or contact support if the problem persists.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0 || isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Quiz</h2>
          <p className="text-slate-300">Loading personalized pricing for your region...</p>
          {location && (
            <p className="text-indigo-400 mt-2">📍 {location.country}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Qualification Quiz
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              {location && (
                <CurrencyIndicator location={location} />
              )}
            </div>
          </div>
          <p className="text-slate-300 mb-6">
            Help us understand your needs to secure your spot in our exclusive early access program
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-slate-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
            
            {currentQuestion.type === 'range' && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-3xl font-bold text-indigo-400">
                    {answers[currentQuestion.id] || currentQuestion.min || 1}
                  </span>
                  <p className="text-slate-400 text-sm mt-1">
                    {currentQuestion.min} - {currentQuestion.max}
                  </p>
                </div>
                <input
                  type="range"
                  min={currentQuestion.min || 1}
                  max={currentQuestion.max || 10}
                  step={currentQuestion.step || 1}
                  value={answers[currentQuestion.id] || currentQuestion.min || 1}
                  onChange={(e) => handleRangeAnswer(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((answers[currentQuestion.id] || currentQuestion.min || 1) - (currentQuestion.min || 1)) / ((currentQuestion.max || 10) - (currentQuestion.min || 1)) * 100}%, #475569 ${((answers[currentQuestion.id] || currentQuestion.min || 1) - (currentQuestion.min || 1)) / ((currentQuestion.max || 10) - (currentQuestion.min || 1)) * 100}%, #475569 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{currentQuestion.min || 1}</span>
                  <span>{currentQuestion.max || 10}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="text-slate-400 text-sm">
            {currentQuestion.required && (
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                * Required
              </span>
            )}
          </div>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={(currentQuestion.required && answers[currentQuestion.id] === undefined) || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentQuestion.required && answers[currentQuestion.id] === undefined}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>

        {/* Early Access Reminder */}
        <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
          <h3 className="text-yellow-400 font-semibold mb-2">🚀 Limited Early Access</h3>
          <p className="text-slate-300 text-sm">
            Only the first 50 qualified applicants in each country will receive early access to our platform.
            <br />Complete this quiz to secure your spot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QualificationQuizSecure;