export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'range' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
}

export const catParentQuestions: QuizQuestion[] = [
  {
    id: 'frequency',
    question: 'How often do you need cattery services annually?',
    type: 'multiple-choice',
    options: ['1-2 times', '3-4 times', '5-8 times', 'More than 8 times'],
    required: true
  },
  {
    id: 'challenge',
    question: "What's your biggest challenge when booking catteries?",
    type: 'multiple-choice',
    options: [
      'Finding availability',
      'Comparing prices',
      'Reading reviews',
      'Booking process complexity',
      'Communication with owners'
    ],
    required: true
  },
  {
    id: 'advance-booking',
    question: 'How far in advance do you typically book?',
    type: 'multiple-choice',
    options: ['Same week', '1-2 weeks', '1 month', '2-3 months', '3+ months'],
    required: true
  },
  {
    id: 'budget',
    question: "What's your average budget per stay?",
    type: 'multiple-choice',
    options: ['Under $25', '$25-40', '$40-60', '$60-80', 'Over $80'],
    required: true
  },
  {
    id: 'pricing-tier-preference',
    question: 'Which pricing tier would you be most interested in for a cattery booking platform?',
    type: 'multiple-choice',
    options: [
      '🐾 Truffle (Starter): FREE Forever - basic search & booking',
      '🐾 Pepper (Growth): $3.99/month or $38/year (save $10) - advanced filters & priority',
      '🐾 Chicken (Premium): $7.99/month or $77/year (save $19) - concierge service & premium features',
      'I prefer pay-per-use instead of subscriptions',
      'I only want completely free services'
    ],
    required: true
  },
  {
    id: 'cat-count',
    question: 'How many cats do you own?',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    required: true
  },
  {
    id: 'special-needs',
    question: 'Do any of your cats have special needs (medication, dietary requirements, etc.)?',
    type: 'multiple-choice',
    options: ['Yes, multiple cats', 'Yes, one cat', 'No, but interested in advanced care options', 'No special needs'],
    required: true
  },
  {
    id: 'booking-method',
    question: "What's your preferred booking method?",
    type: 'multiple-choice',
    options: ['Mobile app', 'Website', 'Phone call', 'Email', 'Concierge service'],
    required: true
  },
  {
    id: 'annual-billing-preference',
    question: 'Would you prefer annual billing to save money on premium features?',
    type: 'multiple-choice',
    options: [
      'Yes, annual billing for savings (Pepper: save $10/year, Chicken: save $19/year)',
      'No, I prefer monthly billing for flexibility',
      'I only want the free Truffle tier',
      'I prefer pay-per-use instead',
      'Depends on the exact savings amount'
    ],
    required: true
  }
];

export const catteryOwnerQuestions: QuizQuestion[] = [
  {
    id: 'capacity',
    question: 'How many cats can you accommodate at maximum capacity?',
    type: 'range',
    min: 1,
    max: 100,
    step: 1,
    required: true
  },
  {
    id: 'booking-management',
    question: 'How do you currently manage bookings?',
    type: 'multiple-choice',
    options: [
      'Paper calendar/notebook',
      'Basic digital calendar',
      'Spreadsheet',
      'Specialized software',
      'Third-party platform'
    ],
    required: true
  },
  {
    id: 'occupancy-rate',
    question: "What's your average occupancy rate?",
    type: 'multiple-choice',
    options: ['Under 30%', '30-50%', '50-70%', '70-85%', 'Over 85%'],
    required: true
  },
  {
    id: 'main-challenge',
    question: "What's your main business challenge?",
    type: 'multiple-choice',
    options: [
      'Finding new customers',
      'Managing bookings',
      'Payment processing',
      'Marketing',
      'Seasonal fluctuations'
    ],
    required: true
  },
  {
    id: 'pricing-tier-preference',
    question: 'Which pricing tier would work best for your cattery business?',
    type: 'multiple-choice',
    options: [
      '🐾 Truffle (Starter): $15/month or $144/year (save $36) - basic booking management',
      '🐾 Pepper (Growth): $29/month or $278/year (save $70) - growth features & analytics',
      '🐾 Chicken (Premium): $59/month or $566/year (save $142) - full marketing suite & premium support',
      'I prefer pay-per-booking commission model',
      'I need custom enterprise pricing'
    ],
    required: true
  },
  {
    id: 'feature-interest',
    question: 'How interested are you in premium business features? (1 = Not interested, 10 = Very interested)',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    required: true
  },
  {
    id: 'marketing-spend',
    question: 'How much do you currently spend on marketing monthly?',
    type: 'multiple-choice',
    options: ['Nothing', 'Under $50', '$50-150', '$150-300', 'Over $300'],
    required: true
  },
  {
    id: 'annual-billing-preference',
    question: 'Would annual billing with significant savings appeal to you?',
    type: 'multiple-choice',
    options: [
      'Yes, annual billing saves money (Truffle: save $36/year, Pepper: save $70/year, Chicken: save $142/year)',
      'No, I prefer monthly billing for cash flow',
      'I prefer commission-based pricing instead',
      'Depends on the exact savings amount',
      'I need to see the platform first'
    ],
    required: true
  },
  {
    id: 'years-in-business',
    question: 'How many years have you been operating your cattery?',
    type: 'multiple-choice',
    options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'Over 10 years'],
    required: true
  }
];

// Scoring logic for the new quiz structure
export const calculateQuizScore = (answers: Record<string, number>, userType: 'cat-parent' | 'cattery-owner' = 'cat-parent'): { score: number; tier: string; qualified: boolean } => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const questions = userType === 'cat-parent' ? catParentQuestions : catteryOwnerQuestions;

  questions.forEach(question => {
    const answerValue = answers[question.id];
    
    if (answerValue !== undefined) {
      if (question.type === 'multiple-choice' && question.options) {
        // For multiple choice, use the answer index
        totalScore += answerValue;
        maxPossibleScore += question.options.length - 1;
      } else if (question.type === 'range') {
        // For range questions, normalize to 0-3 scale
        const normalized = ((answerValue - (question.min || 0)) / ((question.max || 10) - (question.min || 0))) * 3;
        totalScore += normalized;
        maxPossibleScore += 3;
      }
    }
  });

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  
  // Tier classification
  let tier: string;
  let qualified: boolean;
  
  if (percentage >= 75) {
    tier = "Premium Prospect";
    qualified = true;
  } else if (percentage >= 60) {
    tier = "Qualified Lead"; 
    qualified = true;
  } else if (percentage >= 40) {
    tier = "Potential User";
    qualified = false;
  } else {
    tier = "Not Ready";
    qualified = false;
  }

  return { score: Math.round(percentage), tier, qualified };
};

// Get questions filtered by user type
export const getQuizQuestionsForUser = (userType: 'cat-parent' | 'cattery-owner'): QuizQuestion[] => {
  return userType === 'cat-parent' ? catParentQuestions : catteryOwnerQuestions;
};

// Legacy export for compatibility
export const quizQuestions = [...catParentQuestions, ...catteryOwnerQuestions];