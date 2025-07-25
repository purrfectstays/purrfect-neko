export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'range' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  // Enhanced properties
  emoji?: string;
  description?: string;
  milestone?: boolean;
  progressText?: string;
}

// Psychology-optimized Cat Parent Questions - Enhanced Flow
export const catParentQuestionsEnhanced: QuizQuestion[] = [
  // 🎣 HOOK (Q1) - Start with engagement about their cats
  {
    id: 'cat-count',
    question: 'How many cats do you have?',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    required: true,
    emoji: '🐱',
    description: 'Every cat deserves purr-fect care! ✨',
    progressText: 'Tell us about your furry family!'
  },
  
  // ⚡ EASY WIN (Q2) - Build momentum with simple frequency
  {
    id: 'frequency',
    question: 'How often do you need cattery services?',
    type: 'multiple-choice',
    options: [
      '🌟 Occasional traveler (1-2 times/year)',
      '✈️ Regular traveler (3-4 times/year)', 
      '🗺️ Frequent traveler (5-6 times/year)',
      '🧳 Very frequent traveler (7-8 times/year)',
      '🌍 Always on the go (8+ times/year)'
    ],
    required: true,
    emoji: '✈️',
    description: 'Understanding your travel style helps us customize your experience',
    progressText: 'Understanding your travel style'
  },

  // 💡 VALUE DISCOVERY (Q3) - Show understanding of pain points
  {
    id: 'challenge',
    question: "What's your biggest challenge when booking cattery?",
    type: 'multiple-choice',
    options: [
      '😤 Finding available spots when I need them',
      '💰 Understanding what I\'m really paying for',
      '🤔 Knowing which reviews to trust',
      '📱 Simple, stress-free booking process',
      '💬 Clear communication and updates'
    ],
    required: true,
    emoji: '💡',
    description: 'Help us solve what frustrates you most!',
    progressText: 'Identifying your pain points',
    milestone: true
  },

  // 🎯 PLANNING (Q4) - Logical follow-up to booking challenges  
  {
    id: 'advance-booking',
    question: 'How far ahead do you prefer to book?',
    type: 'multiple-choice',
    options: [
      '⚡ Last-minute planner (same week)',
      '📅 Short-term planner (1-2 weeks)',
      '🗓️ Monthly planner (1 month ahead)',
      '📋 Advance planner (2-3 months)',
      '🎯 Super organized (3+ months ahead)'
    ],
    required: true,
    emoji: '📅',
    description: 'Planning style helps us design the perfect booking experience',
    progressText: 'Understanding your planning preferences'
  },

  // 🏠 SPECIAL NEEDS (Q5) - Shows we care about individual needs
  {
    id: 'special-needs',
    question: 'Do your cats need special care?',
    type: 'multiple-choice',
    options: [
      '💊 Yes, multiple cats with special needs',
      '🩺 Yes, one cat with special requirements', 
      '✨ No, but interested in premium care options',
      '😸 No special needs, standard care is perfect'
    ],
    required: true,
    emoji: '🏠',
    description: 'Every cat is unique - we want to match you with the right care',
    progressText: 'Matching you with perfect care options'
  },

  // 💰 BUDGET DISCOVERY (Q6) - After establishing value, ask investment
  {
    id: 'budget',
    question: "What's your average budget per stay?",
    type: 'multiple-choice',
    options: [
      '💫 Budget-conscious (Under $25/night)',
      '⚖️ Value-focused ($25-40/night)',
      '🏆 Quality-focused ($40-60/night)',
      '💎 Premium experience ($60-80/night)',
      '👑 Luxury-only (Over $80/night)'
    ],
    required: true,
    emoji: '💰',
    description: 'Almost there! Let\'s find your perfect price point',
    progressText: 'Finding your perfect price point',
    milestone: true
  },

  // 📱 PREFERENCE (Q7) - Service design based on preferences
  {
    id: 'booking-method',
    question: 'How would you prefer to book?',
    type: 'multiple-choice',
    options: [
      '📱 Mobile app (book anywhere, anytime)',
      '💻 Website (detailed browsing experience)',
      '☎️ Phone call (personal touch)',
      '📧 Email (written confirmation)',
      '🎩 Concierge service (white-glove experience)'
    ],
    required: true,
    emoji: '📱',
    description: 'Your preferred method shapes how we build the platform',
    progressText: 'Designing your ideal booking experience'
  },

  // 🎖️ PRICING PREFERENCE (Q8) - Market research without specific pricing
  {
    id: 'pricing-preference',
    question: 'Which service tier interests you most?',
    type: 'multiple-choice',
    options: [
      '🌱 Free tier with basic features',
      '🌶️ Low monthly fee for premium features', 
      '🍗 Higher monthly fee for all features + concierge',
      '💳 Pay-per-use (no monthly commitment)',
      '🎁 Only free services for me'
    ],
    required: true,
    emoji: '🎖️',
    description: 'Choose what works best for your cat care needs',
    progressText: 'Selecting your perfect service level'
  },

  // 💎 BILLING PREFERENCE (Q9) - Market research without specific commitments
  {
    id: 'billing-preference',
    question: 'What billing frequency would work best for you?',
    type: 'multiple-choice',
    options: [
      '💰 Annual billing for potential savings',
      '📅 Monthly billing for flexibility',
      '🆓 Only free tier options for me',
      '💳 Pay-per-use when I need it',
      '🤔 Depends on the value provided'
    ],
    required: true,
    emoji: '💎',
    description: 'You\'re shaping the future of cat care! 🚀',
    progressText: 'Final question - you\'re almost done!',
    milestone: true
  }
];

// Enhanced Cattery Owner Questions - Business-focused flow
export const catteryOwnerQuestionsEnhanced: QuizQuestion[] = [
  // Business capacity - concrete starting point
  {
    id: 'capacity',
    question: 'How many cats can you accommodate at maximum capacity?',
    type: 'range',
    min: 1,
    max: 100,
    step: 1,
    required: true,
    emoji: '🏢',
    description: 'Understanding your scale helps us customize business features',
    progressText: 'Tell us about your cattery capacity'
  },

  // Years in business - credibility and experience
  {
    id: 'years-in-business',
    question: 'How many years have you been operating your cattery?',
    type: 'multiple-choice',
    options: [
      '🌱 New to the business (Less than 1 year)',
      '📈 Growing operation (1-3 years)',
      '🎯 Established business (3-5 years)',
      '🏆 Experienced operator (5-10 years)',
      '👑 Industry veteran (Over 10 years)'
    ],
    required: true,
    emoji: '📅',
    description: 'Your experience level helps us recommend the right tools',
    progressText: 'Understanding your business experience'
  },

  // Current occupancy - business performance indicator
  {
    id: 'occupancy-rate',
    question: "What's your average occupancy rate?",
    type: 'multiple-choice',
    options: [
      '📉 Building clientele (Under 30%)',
      '📊 Growing steadily (30-50%)',
      '📈 Good performance (50-70%)',
      '🎯 Strong performance (70-85%)',
      '🔥 Always booked (Over 85%)'
    ],
    required: true,
    emoji: '📊',
    description: 'Performance data helps us understand your growth stage',
    progressText: 'Assessing your business performance',
    milestone: true
  },

  // Main challenge - pain point identification
  {
    id: 'main-challenge',
    question: "What's your main business challenge?",
    type: 'multiple-choice',
    options: [
      '👥 Finding new customers',
      '📋 Managing bookings efficiently',
      '💳 Payment processing hassles',
      '📢 Marketing and visibility',
      '📅 Seasonal fluctuations'
    ],
    required: true,
    emoji: '🎯',
    description: 'Help us prioritize features that solve your biggest problems',
    progressText: 'Identifying your biggest challenges'
  },

  // Current booking management - technology adoption
  {
    id: 'booking-management',
    question: 'How do you currently manage bookings?',
    type: 'multiple-choice',
    options: [
      '📝 Paper calendar/notebook (old school)',
      '📅 Basic digital calendar (simple)',
      '📊 Spreadsheet system (organized)',
      '💻 Specialized software (advanced)',
      '🌐 Third-party platform (integrated)'
    ],
    required: true,
    emoji: '💻',
    description: 'Your current system helps us design the right transition',
    progressText: 'Understanding your current workflow'
  },

  // Marketing spend - budget indication
  {
    id: 'marketing-spend',
    question: 'How much do you currently spend on marketing monthly?',
    type: 'multiple-choice',
    options: [
      '🚫 Nothing (word-of-mouth only)',
      '💫 Under $50 (minimal budget)',
      '💰 $50-150 (moderate investment)',
      '💎 $150-300 (serious marketing)',
      '👑 Over $300 (major investment)'
    ],
    required: true,
    emoji: '📢',
    description: 'Marketing budget helps us recommend growth strategies',
    progressText: 'Understanding your marketing investment',
    milestone: true
  },

  // Pricing tier - business investment level
  {
    id: 'pricing-tier-preference',
    question: 'Which pricing tier would work best for your cattery business?',
    type: 'multiple-choice',
    options: [
      '🌱 Truffle Starter: Essential tools ($15/month)',
      '🌶️ Pepper Growth: Advanced features ($29/month)',
      '🍗 Chicken Premium: Full marketing suite ($59/month)',
      '💼 Commission-based model (pay per booking)',
      '🏢 Custom enterprise pricing needed'
    ],
    required: true,
    emoji: '💼',
    description: 'Choose the investment level that fits your business',
    progressText: 'Selecting your business tier'
  },

  // Feature interest - engagement level
  {
    id: 'feature-interest',
    question: 'How interested are you in premium business features?',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    required: true,
    emoji: '⭐',
    description: 'Rate your interest level (1 = Not interested, 10 = Very interested)',
    progressText: 'Gauging your interest in advanced features'
  },

  // Annual billing - commitment level
  {
    id: 'annual-billing-preference',
    question: 'Would annual billing with significant savings appeal to you?',
    type: 'multiple-choice',
    options: [
      '💰 Yes, annual billing saves money (up to $142/year savings)',
      '📅 No, monthly billing for cash flow management',
      '💼 Commission-based pricing preferred',
      '🤔 Depends on exact savings amount',
      '👀 Need to see the platform first'
    ],
    required: true,
    emoji: '💎',
    description: 'Final question - help us design the perfect pricing!',
    progressText: 'Almost done - final business preference!',
    milestone: true
  }
];

// Enhanced scoring logic with better tier names
export const calculateQuizScoreEnhanced = (answers: Record<string, number>, userType: 'cat-parent' | 'cattery-owner' = 'cat-parent'): { 
  score: number; 
  tier: string; 
  qualified: boolean;
  description: string;
  benefits: string[];
} => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const questions = userType === 'cat-parent' ? catParentQuestionsEnhanced : catteryOwnerQuestionsEnhanced;

  questions.forEach(question => {
    const answerValue = answers[question.id];
    
    if (answerValue !== undefined) {
      if (question.type === 'multiple-choice' && question.options) {
        totalScore += answerValue;
        maxPossibleScore += question.options.length - 1;
      } else if (question.type === 'range') {
        const normalized = ((answerValue - (question.min || 0)) / ((question.max || 10) - (question.min || 0))) * 3;
        totalScore += normalized;
        maxPossibleScore += 3;
      }
    }
  });

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  
  // Enhanced tier classification with descriptions and benefits
  let tier: string;
  let qualified: boolean;
  let description: string;
  let benefits: string[];
  
  if (percentage >= 75) {
    tier = "Premium Prospect";
    qualified = true;
    description = "Perfect match! You're exactly who we're building this platform for.";
    benefits = [
      "🎯 Priority access to beta launch",
      "💎 Lifetime founding member benefits", 
      "🎁 50% discount on first premium booking",
      "👑 Exclusive premium support channel"
    ];
  } else if (percentage >= 60) {
    tier = "Qualified Lead";
    qualified = true;
    description = "Great fit! You'll love what we're building for the cat community.";
    benefits = [
      "✅ Early access to platform launch",
      "🎖️ Founding member recognition",
      "💰 25% discount on first booking",
      "📞 Priority customer support"
    ];
  } else if (percentage >= 40) {
    tier = "Potential User";
    qualified = false;
    description = "Interesting profile! We'll keep you updated as we develop features for users like you.";
    benefits = [
      "📧 Regular updates on platform development",
      "🎁 Early access opportunity",
      "💡 Influence on feature development"
    ];
  } else {
    tier = "Not Ready";
    qualified = false;
    description = "Thanks for your interest! We'll reach out when we have features that better match your needs.";
    benefits = [
      "📬 Occasional updates on major milestones",
      "🔄 Re-qualification opportunity in the future"
    ];
  }

  return { 
    score: Math.round(percentage), 
    tier, 
    qualified,
    description,
    benefits
  };
};

// Get enhanced questions filtered by user type
export const getEnhancedQuizQuestionsForUser = (userType: 'cat-parent' | 'cattery-owner'): QuizQuestion[] => {
  return userType === 'cat-parent' ? catParentQuestionsEnhanced : catteryOwnerQuestionsEnhanced;
};

// Progress milestones for gamification
export const getProgressMilestones = (userType: 'cat-parent' | 'cattery-owner') => {
  const questions = getEnhancedQuizQuestionsForUser(userType);
  const milestones = questions
    .map((q, index) => ({ ...q, index }))
    .filter(q => q.milestone)
    .map(q => ({
      questionIndex: q.index,
      title: q.progressText || q.question,
      reward: `Milestone ${q.index + 1} unlocked!`
    }));
  
  return milestones;
};

// Backward compatibility
export const quizQuestionsEnhanced = [...catParentQuestionsEnhanced, ...catteryOwnerQuestionsEnhanced];