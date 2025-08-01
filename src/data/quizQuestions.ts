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
    id: 'pricing-preference',
    question: 'What pricing model would work best for you?',
    type: 'multiple-choice',
    options: [
      'Free with basic features',
      'Low monthly fee ($5-10) for premium features',
      'Higher monthly fee ($10-20) for all features',
      'One-time payment for lifetime access',
      'Pay per booking/transaction'
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
    id: 'billing-preference',
    question: 'What billing frequency would you prefer?',
    type: 'multiple-choice',
    options: [
      'Monthly billing for flexibility',
      'Annual billing for potential savings',
      'One-time payment preferred',
      'Pay per use/transaction only',
      'Free tier only'
    ],
    required: true
  },
  {
    id: 'real-time-availability-value',
    question: 'How valuable would REAL-TIME cattery availability be to you?',
    type: 'multiple-choice',
    options: [
      'Extremely valuable - would pay premium for this feature',
      'Very valuable - main reason I would use the platform',
      'Somewhat valuable - nice to have feature',
      'Not particularly valuable - current methods work fine',
      'I prefer calling catteries directly'
    ],
    required: true
  },
  {
    id: 'local-market-spending',
    question: 'In your local area, what do you typically spend per day for quality cattery care?',
    type: 'multiple-choice',
    options: [
      'Under £20/day ($25/day)',
      '£20-35/day ($25-45/day)',
      '£35-50/day ($45-65/day)',
      '£50-75/day ($65-95/day)',
      'Over £75/day ($95+/day)'
    ],
    required: true
  },
  {
    id: 'saas-willingness-to-pay',
    question: 'For a platform with real-time availability + verified reviews + easy booking, how much would you pay monthly?',
    type: 'multiple-choice',
    options: [
      'Free only (ad-supported)',
      '£3-8/month ($4-10/month) - Basic features',
      '£8-15/month ($10-18/month) - Premium features',
      '£15-25/month ($18-30/month) - All features + priority',
      'One-time payment preferred (£30-50 lifetime)'
    ],
    required: true
  }
];

export const catteryOwnerQuestions: QuizQuestion[] = [
  {
    id: 'capacity',
    question: 'How many cats can you accommodate at maximum capacity?',
    type: 'multiple-choice',
    options: [
      'Small cattery (20-40 cats)',
      'Medium cattery (41-60 cats)',
      'Large cattery (61-80 cats)',
      'Very large cattery (81-100 cats)',
      'Enterprise cattery (101+ cats)'
    ],
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
  },
  {
    id: 'biggest-booking-challenge',
    question: 'What is your BIGGEST challenge with current booking management?',
    type: 'multiple-choice',
    options: [
      'Last-minute cancellations and empty spots',
      'Low online visibility - customers can\'t find me',
      'Manual booking management takes too much time',
      'Pricing competition from other catteries',
      'Seasonal demand gaps and cash flow'
    ],
    required: true
  },
  {
    id: 'saas-platform-willingness',
    question: 'For a SaaS platform that increases your bookings through real-time visibility, what would you pay monthly?',
    type: 'multiple-choice',
    options: [
      '£25/month ($30/month) - Basic listing + booking tools',
      '£50/month ($60/month) - Premium features + analytics',
      '£100/month ($120/month) - Full marketing suite + priority listing',
      'Commission-based (3-5% per booking)',
      'I prefer managing bookings myself'
    ],
    required: true
  },
  {
    id: 'revenue-boost-interest',
    question: 'If a platform could increase your bookings by 25-40%, how much would that be worth to your business monthly?',
    type: 'multiple-choice',
    options: [
      'Under £100/month additional revenue',
      '£100-300/month additional revenue',
      '£300-600/month additional revenue',
      '£600-1000/month additional revenue',
      'Over £1000/month additional revenue'
    ],
    required: true
  },
  {
    id: 'feature-priority-validation',
    question: 'Which feature would have the BIGGEST impact on your business success?',
    type: 'multiple-choice',
    options: [
      'Real-time availability display to customers',
      'Automated booking confirmation and payment',
      'Professional photos and virtual tours',
      'Customer review management system',
      'Regional marketing and SEO optimization'
    ],
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