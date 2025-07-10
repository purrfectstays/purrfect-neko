import { QuizQuestion } from '../data/quizQuestions';
import { CurrencyService } from './currencyService';
import { GeolocationService, LocationData } from './geolocationService';

export class LocalizedQuizService {
  /**
   * Get localized quiz questions based on user location
   */
  static async getLocalizedQuestions(
    userType: 'cat-parent' | 'cattery-owner',
    location?: LocationData
  ): Promise<QuizQuestion[]> {
    // Get user location if not provided
    if (!location) {
      location = await GeolocationService.getUserLocation();
    }

    const countryCode = location.countryCode;

    if (userType === 'cat-parent') {
      return this.getLocalizedCatParentQuestions(countryCode);
    } else {
      return this.getLocalizedCatteryOwnerQuestions(countryCode);
    }
  }

  /**
   * Get localized cat parent questions
   */
  private static async getLocalizedCatParentQuestions(countryCode: string): Promise<QuizQuestion[]> {
    // Get localized budget ranges
    const budgetRanges = await CurrencyService.getLocalizedBudgetRanges(countryCode);
    
    // Get localized pricing tiers
    const pepperPricing = await CurrencyService.getLocalizedPricing('catParent', 'pepper', countryCode);
    const chickenPricing = await CurrencyService.getLocalizedPricing('catParent', 'chicken', countryCode);

    return [
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
        options: budgetRanges,
        required: true
      },
      {
        id: 'pricing-tier-preference',
        question: 'Which pricing tier would you be most interested in for a cattery booking platform?',
        type: 'multiple-choice',
        options: [
          '🐾 Truffle (Starter): FREE Forever - basic search & booking',
          `🐾 Pepper (Growth): ${pepperPricing.monthly}/month or ${pepperPricing.annual}/year (save ${pepperPricing.savings}) - advanced filters & priority`,
          `🐾 Chicken (Premium): ${chickenPricing.monthly}/month or ${chickenPricing.annual}/year (save ${chickenPricing.savings}) - concierge service & premium features`,
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
          `Yes, annual billing for savings (Pepper: save ${pepperPricing.savings}/year, Chicken: save ${chickenPricing.savings}/year)`,
          'No, I prefer monthly billing for flexibility',
          'I only want the free Truffle tier',
          'I prefer pay-per-use instead',
          'Depends on the exact savings amount'
        ],
        required: true
      }
    ];
  }

  /**
   * Get localized cattery owner questions
   */
  private static async getLocalizedCatteryOwnerQuestions(countryCode: string): Promise<QuizQuestion[]> {
    // Get localized marketing spend ranges
    const marketingRanges = await CurrencyService.getLocalizedMarketingRanges(countryCode);
    
    // Get localized pricing tiers
    const trufflePricing = await CurrencyService.getLocalizedPricing('catteryOwner', 'truffle', countryCode);
    const pepperPricing = await CurrencyService.getLocalizedPricing('catteryOwner', 'pepper', countryCode);
    const chickenPricing = await CurrencyService.getLocalizedPricing('catteryOwner', 'chicken', countryCode);

    return [
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
          `🐾 Truffle (Starter): ${trufflePricing.monthly}/month or ${trufflePricing.annual}/year (save ${trufflePricing.savings}) - basic booking management`,
          `🐾 Pepper (Growth): ${pepperPricing.monthly}/month or ${pepperPricing.annual}/year (save ${pepperPricing.savings}) - growth features & analytics`,
          `🐾 Chicken (Premium): ${chickenPricing.monthly}/month or ${chickenPricing.annual}/year (save ${chickenPricing.savings}) - full marketing suite & premium support`,
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
        options: marketingRanges,
        required: true
      },
      {
        id: 'annual-billing-preference',
        question: 'Would annual billing with significant savings appeal to you?',
        type: 'multiple-choice',
        options: [
          `Yes, annual billing saves money (Truffle: save ${trufflePricing.savings}/year, Pepper: save ${pepperPricing.savings}/year, Chicken: save ${chickenPricing.savings}/year)`,
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
  }

  /**
   * Get currency information for display
   */
  static async getCurrencyInfo(location?: LocationData) {
    if (!location) {
      location = await GeolocationService.getUserLocation();
    }

    const currency = CurrencyService.getCurrencyForCountry(location.countryCode);
    const isSupported = CurrencyService.isCurrencySupported(location.countryCode);

    return {
      currency,
      isSupported,
      displayName: CurrencyService.getCurrencyDisplayName(location.countryCode),
      country: location.country
    };
  }

  /**
   * Preload currency rates for better performance
   */
  static async preloadCurrencyRates(): Promise<void> {
    try {
      await CurrencyService.getExchangeRates();
    } catch (error) {
      console.warn('Failed to preload currency rates:', error);
    }
  }
}