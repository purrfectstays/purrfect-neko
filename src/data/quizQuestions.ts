export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  userType?: 'cat-parent' | 'cattery-owner' | 'both';
  isQualifying?: boolean;
  weight?: number;
}

// Following ScoreApp and Daniel Priestley principles:
// 1. Questions that qualify leads
// 2. Questions that educate about the value proposition
// 3. Questions that create desire for the service
// 4. One qualifying question to filter serious applicants

export const quizQuestions: QuizQuestion[] = [
  // Question 1: Universal qualifying question
  {
    id: "commitment_level",
    question: "How committed are you to finding a premium cattery solution in the next 6 months?",
    options: [
      "Extremely committed - I need this urgently",
      "Very committed - actively looking for solutions", 
      "Somewhat committed - exploring options",
      "Just browsing - not ready to commit yet"
    ],
    userType: "both",
    isQualifying: true,
    weight: 3
  },

  // Question 2: For Cat Parents - Pain Point & Value
  {
    id: "cat_parent_pain",
    question: "What's your biggest frustration with current cattery options?",
    options: [
      "Can't find availability when I need it",
      "Lack of real-time updates about my cat's wellbeing",
      "Limited premium facilities in my area", 
      "Difficulty comparing quality and prices easily"
    ],
    userType: "cat-parent",
    weight: 2
  },

  // Question 3: For Cattery Owners - Business Challenge
  {
    id: "cattery_owner_challenge", 
    question: "What's your biggest challenge in growing your cattery business?",
    options: [
      "Not enough visibility to attract new clients",
      "Manual booking system causing scheduling conflicts",
      "Difficulty showcasing my premium services effectively",
      "Competing with larger facilities on marketing"
    ],
    userType: "cattery-owner",
    weight: 2
  },

  // Question 4: Cat Parent - Willingness to Pay for Premium
  {
    id: "premium_value",
    question: "How much would you pay EXTRA per day for a cattery that provides real-time photo updates and premium care?",
    options: [
      "$15-25 extra per day - peace of mind is priceless",
      "$10-15 extra per day - worth it for quality",
      "$5-10 extra per day - reasonable for premium service",
      "I prefer the cheapest option available"
    ],
    userType: "cat-parent",
    weight: 2
  },

  // Question 5: Cattery Owner - Revenue Opportunity
  {
    id: "revenue_opportunity",
    question: "How much additional monthly revenue would justify using a premium booking platform?",
    options: [
      "$2,000+ - ready to invest in serious growth",
      "$1,000-2,000 - would significantly impact my business", 
      "$500-1,000 - modest but worthwhile improvement",
      "Any amount - I need more clients desperately"
    ],
    userType: "cattery-owner", 
    weight: 2
  },

  // Question 6: Universal - Technology Adoption
  {
    id: "technology_readiness",
    question: "How do you feel about using innovative technology to solve cattery challenges?",
    options: [
      "I'm an early adopter - love trying new solutions",
      "I embrace technology that clearly adds value",
      "I'm cautious but open to proven solutions",
      "I prefer traditional methods over new technology"
    ],
    userType: "both",
    weight: 1
  },

  // Question 7: Cat Parent - Service Frequency  
  {
    id: "usage_frequency",
    question: "How often do you typically need cattery services?",
    options: [
      "Monthly or more - I travel frequently for work/leisure",
      "Every 2-3 months - regular vacation traveler",
      "2-4 times per year - seasonal travel",
      "Rarely - only for emergencies"
    ],
    userType: "cat-parent",
    weight: 2
  },

  // Question 8: Cattery Owner - Growth Ambition
  {
    id: "growth_ambition", 
    question: "What's your primary goal for your cattery business?",
    options: [
      "Become the premium cattery leader in my region",
      "Double my revenue within the next 12 months",
      "Build a sustainable, profitable family business",
      "Just maintain my current client base"
    ],
    userType: "cattery-owner",
    weight: 2
  },

  // Question 9: Universal - Early Access Value
  {
    id: "early_access_value",
    question: "Why is being among the first 50 users in your country important to you?",
    options: [
      "I want to shape the platform and influence its development",
      "Early access gives me a competitive advantage",
      "I love being part of exclusive, innovative communities", 
      "I'm not particularly interested in being first"
    ],
    userType: "both",
    isQualifying: true,
    weight: 2
  }
];

// Scoring logic based on ScoreApp principles
export const calculateQuizScore = (answers: Record<string, number>): { score: number; tier: string; qualified: boolean } => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  quizQuestions.forEach(question => {
    const answerIndex = answers[question.id];
    const weight = question.weight || 1;
    
    if (answerIndex !== undefined) {
      // Higher option index = higher score (last option is usually best)
      const questionScore = answerIndex * weight;
      totalScore += questionScore;
    }
    
    // Max score is highest option index * weight
    maxPossibleScore += (question.options.length - 1) * weight;
  });

  const percentage = (totalScore / maxPossibleScore) * 100;
  
  // Tier classification following ScoreApp methodology
  let tier: string;
  let qualified: boolean;
  
  if (percentage >= 80) {
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
  return quizQuestions.filter(q => q.userType === 'both' || q.userType === userType);
};