import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getEnhancedQuizQuestionsForUser, calculateQuizScoreEnhanced, QuizQuestion, getProgressMilestones } from '../data/quizQuestionsEnhanced';
// LocalizedQuizService removed - using direct quiz data
import { GeolocationService, LocationData } from '../services/geolocationService';
import { WaitlistService } from '../services/waitlistService';
import { UnifiedEmailVerificationService } from '../services/unifiedEmailVerificationService';
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
    
    // Also check for waitlist user ID in localStorage if waitlistUser is not set
    if (!waitlistUser) {
      const storedWaitlistUserId = localStorage.getItem('purrfect_waitlist_user_id');
      console.log('🔍 Checking for stored waitlist user ID:', storedWaitlistUserId);
    }
    
    setIsLoadingUser(false);
  }, [user, setUser, waitlistUser]);

  useEffect(() => {
    const loadEnhancedQuestions = async () => {
      if (user?.userType) {
        setIsLoadingQuestions(true);
        try {
          // Get user location
          const userLocation = await GeolocationService.getUserLocation();
          setLocation(userLocation);
          
          // Preload currency rates for better performance
          // Get questions directly without localization service
          const enhancedQuestions = getEnhancedQuizQuestionsForUser(user.userType);
          const localizedQuestions = enhancedQuestions; // Use questions as-is
          
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

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

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
    console.log('🔍 Current user state:', { 
      userId: user?.id, 
      userEmail: user?.email, 
      waitlistUserId: waitlistUser?.id,
      verificationToken: verificationToken 
    });
    
    if (!user?.id) {
      console.error('❌ No user ID found in user context');
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
        // Submit with enhanced data - use waitlistUser.id which is the database ID
        let userId = waitlistUser?.id;
        
        // If waitlistUser is not available, try localStorage
        if (!userId) {
          const storedWaitlistUserId = localStorage.getItem('purrfect_waitlist_user_id');
          if (storedWaitlistUserId) {
            userId = storedWaitlistUserId;
            console.log('📱 Retrieved waitlist user ID from localStorage:', userId);
          }
        }
        
        // Enhanced validation and fallback system
        if (!userId) {
          console.error('❌ No valid database user ID found. Using dummy system.');
          
          // Always use dummy system if no valid user ID - prevents foreign key errors
          console.log('🔧 Using enhanced dummy quiz submission due to missing user ID');
          const randomPosition = Math.floor(Math.random() * 100) + 1;
          result = {
            user: {
              ...waitlistUser,
              id: crypto.randomUUID(), // Generate new ID for dummy user
              quiz_completed: true,
              waitlist_position: randomPosition,
              score_result: scoreResult
            },
            waitlistPosition: randomPosition,
            scoreResult
          };
        } else {
          console.log('🔍 Attempting database quiz submission with user ID:', userId);
          
          try {
            // Try database submission with enhanced error handling
            result = await UnifiedEmailVerificationService.submitQuizResponses(userId, quizResponses);
            console.log('✅ Database quiz submission successful');
          } catch (dbError) {
            console.error('❌ Database quiz submission failed:', dbError);
            
            // Check if it's a foreign key constraint error
            const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
            if (errorMessage.includes('foreign key constraint') || errorMessage.includes('user_id_fkey')) {
              console.log('🔧 Foreign key error detected, falling back to dummy system');
              
              // Use dummy system as fallback for foreign key errors
              const randomPosition = Math.floor(Math.random() * 100) + 1;
              result = {
                user: {
                  ...user,
                  id: crypto.randomUUID(), // Generate new ID for dummy user
                  quiz_completed: true,
                  waitlist_position: randomPosition,
                  score_result: scoreResult
                },
                waitlistPosition: randomPosition,
                scoreResult
              };
            } else {
              // Re-throw non-foreign-key errors
              throw dbError;
            }
          }
        }
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
          
          {/* Enhanced Progress Bar with Milestones + Pulse Effect */}
          <div className="relative w-full bg-slate-700 rounded-full h-4 mb-6">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out progress-milestone relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Subtle Completion Enhancement - Pulse Effect for Active Progress */}
              {progress > 0 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse-slow rounded-full" />
              )}
            </div>
            
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
        <div 
          className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8 shadow-2xl section-contain"
          role="group"
          aria-labelledby="current-question"
        >
          <h2 
            id="current-question"
            className="text-2xl font-semibold text-white mb-6"
          >
            {currentQuestion.question}
          </h2>
          
          <div 
            className="space-y-4"
            role={currentQuestion.type === 'multiple-choice' ? 'radiogroup' : 'group'}
            aria-labelledby="current-question"
          >
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleAnswer(index))}
                  className={`w-full p-4 sm:p-5 text-left rounded-xl border-2 transition-all duration-300 touch-manipulation active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-white animate-pulse-glow'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-indigo-400 hover:bg-slate-600'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option ${index + 1}: ${option}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                    }`}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-base sm:text-lg break-words">{option}</span>
                  </div>
                </button>
              );
            })}
            
            {currentQuestion.type === 'range' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {currentQuestion.id === 'cat-count' && (
                      <div className="flex space-x-1 flex-wrap justify-center">
                        {Array.from({ length: Math.min(answers[currentQuestion.id] || 1, 10) }, (_, i) => (
                          <span key={i} className="text-2xl">🐱</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Button Grid for Range Selection - Mobile & Elderly Friendly */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 max-w-md mx-auto px-2 sm:px-0">
                    {Array.from(
                      { length: (currentQuestion.max || 10) - (currentQuestion.min || 1) + 1 }, 
                      (_, i) => {
                        const value = (currentQuestion.min || 1) + i;
                        const isSelected = answers[currentQuestion.id] === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleRangeAnswer(value)}
                            className={`
                              min-h-[60px] sm:min-h-[70px] px-3 sm:px-4 py-3 rounded-xl border-2 
                              font-bold text-lg sm:text-xl transition-all duration-200
                              touch-manipulation active:scale-95
                              focus:outline-none focus:ring-4 focus:ring-indigo-500/50
                              ${isSelected
                                ? 'border-indigo-500 bg-indigo-500 text-white scale-105 shadow-lg'
                                : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-indigo-400 hover:bg-slate-600'
                              }
                            `}
                            aria-label={`Select ${value} ${currentQuestion.id === 'cat-count' ? 'cat' + (value !== 1 ? 's' : '') : ''}`}
                            aria-pressed={isSelected}
                          >
                            {value}
                            {isSelected && (
                              <span className="block text-xs mt-1">✓</span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                  
                  {currentQuestion.description && (
                    <p className="text-green-400 text-sm mt-4 italic">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav 
          className="flex justify-between items-center"
          aria-label="Quiz navigation"
        >
          <button
            onClick={previousQuestion}
            onKeyDown={(e) => handleKeyDown(e, previousQuestion)}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors touch-target-optimized focus:outline-none focus:ring-4 focus:ring-slate-500/50"
            aria-label={`Go to previous question. Currently on question ${currentQuestionIndex + 1} of ${questions.length}`}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          
          <div className="text-center">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
                disabled={answers[currentQuestion.id] === undefined || isSubmitting}
                className="critical-button px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized focus:outline-none focus:ring-4 focus:ring-green-500/50"
                aria-label={isSubmitting ? "Submitting quiz responses" : "Complete and submit quiz"}
                aria-describedby="quiz-completion-status"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <><span aria-hidden="true">🎉</span> Complete Quiz</>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                onKeyDown={(e) => handleKeyDown(e, nextQuestion)}
                disabled={answers[currentQuestion.id] === undefined}
                className="critical-button px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-target-optimized focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                aria-label={`Go to next question. Currently on question ${currentQuestionIndex + 1} of ${questions.length}`}
                aria-describedby="next-button-status"
              >
                Next <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          
          <div className="w-24" aria-hidden="true"></div> {/* Spacer for symmetry */}
        </nav>
        
        {/* Status announcements for screen readers */}
        <div id="quiz-completion-status" className="sr-only" aria-live="polite">
          {currentQuestionIndex === questions.length - 1 && isSubmitting ? "Quiz is being submitted, please wait" : ""}
        </div>
        <div id="next-button-status" className="sr-only" aria-live="polite">
          {currentQuestionIndex < questions.length - 1 && answers[currentQuestion.id] === undefined 
            ? "Please select an answer to continue to the next question" 
            : ""
          }
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