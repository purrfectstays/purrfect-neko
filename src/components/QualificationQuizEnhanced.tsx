import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getEnhancedQuizQuestionsForUser, calculateQuizScoreEnhanced, QuizQuestion, getProgressMilestones } from '../data/quizQuestionsEnhanced';
import { LocalizedQuizService } from '../services/localizedQuizService';
import { GeolocationService, LocationData } from '../services/geolocationService';
import { WaitlistService } from '../services/waitlistService';
import CurrencyIndicator from './CurrencyIndicator';
import { analytics } from '../lib/analytics';
import { rateLimiter, RateLimiter } from '../lib/rateLimiter';

const QualificationQuizEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, verificationToken, waitlistUser } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<any>(null);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);

  const progress = ((currentQuestionIndex + 1) / Math.max(questions.length, 1)) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  const milestones = user?.userType ? getProgressMilestones(user.userType) : [];

  useEffect(() => {
    // Check if user exists in context, if not check localStorage
    if (!user) {
      const storedUser = localStorage.getItem('purrfect_verified_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
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
    const loadEnhancedQuestions = async () => {
      if (user?.userType) {
        setIsLoadingQuestions(true);
        try {
          // Get user location
          const userLocation = await GeolocationService.getUserLocation();
          setLocation(userLocation);
          
          // Preload currency rates for better performance
          await LocalizedQuizService.preloadCurrencyRates();
          
          // Get enhanced questions with localization
          const enhancedQuestions = getEnhancedQuizQuestionsForUser(user.userType);
          
          // Apply localization to enhanced questions
          const localizedQuestions = await LocalizedQuizService.localizeEnhancedQuestions(
            enhancedQuestions,
            userLocation
          );
          
          setQuestions(localizedQuestions);
          console.log('✅ Loaded enhanced localized quiz questions for:', userLocation.country);
        } catch (error) {
          console.warn('Failed to load enhanced questions, using default:', error);
          // Fallback to enhanced questions without localization
          const enhancedQuestions = getEnhancedQuizQuestionsForUser(user.userType);
          setQuestions(enhancedQuestions);
        } finally {
          setIsLoadingQuestions(false);
        }
      }
    };

    loadEnhancedQuestions();
  }, [user]);

  // Check for milestones when question changes
  useEffect(() => {
    const milestone = milestones.find(m => m.questionIndex === currentQuestionIndex);
    if (milestone && !completedMilestones.includes(currentQuestionIndex)) {
      setCurrentMilestone(milestone);
      setShowMilestone(true);
      setCompletedMilestones(prev => [...prev, currentQuestionIndex]);
      
      // Auto-hide milestone after 3 seconds
      setTimeout(() => {
        setShowMilestone(false);
      }, 3000);
    }
  }, [currentQuestionIndex, milestones, completedMilestones]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answerIndex
    });
    
    // Track answer for analytics
    analytics.trackUserAction('quiz_answer', {
      questionId: currentQuestion.id,
      questionIndex: currentQuestionIndex,
      answerIndex,
      userType: user?.userType,
      country: location?.country
    });
  };

  const handleRangeAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
    
    analytics.trackUserAction('quiz_range_answer', {
      questionId: currentQuestion.id,
      questionIndex: currentQuestionIndex,
      value,
      userType: user?.userType
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🎯 Enhanced quiz submission started...');
    
    if (!user?.id) {
      console.error('❌ No user ID found');
      alert('User session not found. Please refresh the page and try again.');
      return;
    }
    
    // Rate limiting check
    const isDevelopment = import.meta.env.DEV;
    const clientId = RateLimiter.getClientIdentifier();
    const rateLimitResult = rateLimiter.isAllowed(clientId, 'quiz_submission');
    
    if (!rateLimitResult.allowed && !isDevelopment) {
      const minutes = Math.ceil((rateLimitResult.retryAfter || 0) / 60);
      console.warn('🚫 Rate limited');
      alert(`Too many quiz submission attempts. Please try again in ${minutes} minutes.`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('📊 Calculating enhanced quiz score...');
      // Calculate enhanced score with benefits
      const scoreResult = calculateQuizScoreEnhanced(answers, user.userType);
      
      // Convert answers to API format
      const quizResponses = Object.entries(answers).map(([questionId, answerIndex]) => ({
        question_id: questionId,
        answer: answerIndex.toString(),
        enhanced_score: scoreResult.score,
        tier: scoreResult.tier,
        qualified: scoreResult.qualified
      }));

      console.log('📤 Submitting enhanced quiz responses:', quizResponses);
      
      // Check if using dummy system
      const isDummyUser = verificationToken === 'dummy-token-fallback';
      
      let result;
      if (isDummyUser) {
        console.log('🔧 Using enhanced dummy user system');
        const randomPosition = Math.floor(Math.random() * 100) + 1;
        result = {
          user: {
            ...waitlistUser,
            quiz_completed: true,
            waitlist_position: randomPosition,
            score_result: scoreResult
          },
          waitlistPosition: randomPosition,
          scoreResult
        };
      } else {
        // Submit with enhanced data
        result = await WaitlistService.submitEnhancedQuizResponses(user.id, quizResponses, scoreResult);
      }
      
      console.log('✅ Enhanced quiz submission successful:', result);
      
      // Update user state with enhanced results
      const updatedUser = {
        ...user,
        quizCompleted: true,
        waitlistPosition: result.waitlistPosition,
        scoreResult: result.scoreResult || scoreResult
      };
      
      setUser(updatedUser);
      localStorage.removeItem('purrfect_verified_user');

      console.log('🎉 Navigating to enhanced success page...');
      navigate('/success');
    } catch (error) {
      console.error('❌ Enhanced quiz submission failed:', error);
      if (error instanceof Error) {
        alert(`Quiz submission failed: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
      } else {
        alert('Quiz submission failed. Please try again or contact support if the problem persists.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading Enhanced Quiz</h2>
          <p>Please wait while we prepare your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isVerified) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="mb-6">Please complete registration and verification first.</p>
          <button
            onClick={() => navigate('/')}
            className="critical-button px-6 py-3"
          >
            Return to Registration
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Enhanced Quiz</h2>
          <p className="text-slate-300">Loading personalized pricing for your region...</p>
          {location && (
            <p className="text-indigo-400 mt-2">📍 {location.city}, {location.country}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentQuestion?.progressText || 'Qualification Quiz'}
              </h1>
              {currentQuestion?.emoji && (
                <div className="text-4xl mb-2">{currentQuestion.emoji}</div>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              {location && (
                <CurrencyIndicator location={location} />
              )}
            </div>
          </div>
          
          {currentQuestion?.description && (
            <p className="text-indigo-400 text-lg mb-6 font-medium">
              {currentQuestion.description}
            </p>
          )}
          
          {/* Enhanced Progress Bar with Milestones */}
          <div className="relative w-full bg-slate-700 rounded-full h-4 mb-6">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out progress-milestone"
              style={{ width: `${progress}%` }}
            ></div>
            
            {/* Milestone indicators */}
            {milestones.map((milestone, index) => {
              const milestoneProgress = ((milestone.questionIndex + 1) / questions.length) * 100;
              const isCompleted = completedMilestones.includes(milestone.questionIndex);
              return (
                <div
                  key={index}
                  className={`absolute top-0 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isCompleted ? 'bg-yellow-400 border-yellow-300' : 'bg-slate-600 border-slate-500'
                  }`}
                  style={{ left: `calc(${milestoneProgress}% - 8px)` }}
                  title={milestone.title}
                >
                  {isCompleted && (
                    <div className="w-2 h-2 bg-yellow-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-sm text-slate-400">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Milestone Celebration */}
        {showMilestone && currentMilestone && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fadeInUp">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-bold mb-1">{currentMilestone.reward}</h3>
              <p className="text-sm opacity-90">{currentMilestone.title}</p>
            </div>
          </div>
        )}

        {/* Enhanced Question Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8 shadow-2xl section-contain">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 touch-target-optimized ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-white animate-pulse-glow'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-indigo-400 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              );
            })}
            
            {currentQuestion.type === 'range' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {currentQuestion.id === 'cat-count' && (
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(answers[currentQuestion.id] || 1, 10) }, (_, i) => (
                          <span key={i} className="text-2xl">🐱</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-4xl font-bold text-indigo-400">
                    {answers[currentQuestion.id] || currentQuestion.min || 1}
                  </span>
                  <p className="text-slate-400 text-sm mt-2">
                    {currentQuestion.min} - {currentQuestion.max}
                  </p>
                  {currentQuestion.description && (
                    <p className="text-green-400 text-sm mt-2 italic">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>
                <div className="px-4">
                  <input
                    type="range"
                    min={currentQuestion.min || 1}
                    max={currentQuestion.max || 10}
                    step={currentQuestion.step || 1}
                    value={answers[currentQuestion.id] || currentQuestion.min || 1}
                    onChange={(e) => handleRangeAnswer(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none slider-thumb cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors touch-target-optimized"
          >
            ← Previous
          </button>
          
          <div className="text-center">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={answers[currentQuestion.id] === undefined || isSubmitting}
                className="critical-button px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  '🎉 Complete Quiz'
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={answers[currentQuestion.id] === undefined}
                className="critical-button px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized"
              >
                Next →
              </button>
            )}
          </div>
          
          <div className="w-24"></div> {/* Spacer for symmetry */}
        </div>

        {/* Progress encouragement */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            {currentQuestionIndex < questions.length - 1 ? (
              `${questions.length - currentQuestionIndex - 1} questions left - you're doing great! 🚀`
            ) : (
              'Last question - you\'re shaping the future of cat care! 🎯'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QualificationQuizEnhanced;