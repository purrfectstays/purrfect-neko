interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate from USD
}

interface RegionalCurrency {
  countryCode: string;
  country: string;
  currency: CurrencyInfo;
}

interface PricingTier {
  usdMonthly: number;
  usdAnnual: number;
}

export class CurrencyService {
  private static cachedRates: Map<string, number> = new Map();
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

  // Regional currency mapping
  private static readonly REGIONAL_CURRENCIES: RegionalCurrency[] = [
    {
      countryCode: 'NZ',
      country: 'New Zealand',
      currency: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.65 }
    },
    {
      countryCode: 'AU', 
      country: 'Australia',
      currency: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.55 }
    },
    {
      countryCode: 'GB',
      country: 'United Kingdom', 
      currency: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 }
    },
    {
      countryCode: 'CA',
      country: 'Canada',
      currency: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 }
    },
    {
      countryCode: 'SG',
      country: 'Singapore',
      currency: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 }
    },
    {
      countryCode: 'EU',
      country: 'European Union',
      currency: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 }
    },
    {
      countryCode: 'JP',
      country: 'Japan',
      currency: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.0 }
    },
    {
      countryCode: 'US',
      country: 'United States',
      currency: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 }
    }
  ];

  // Default pricing tiers in USD
  private static readonly PRICING_TIERS = {
    catParent: {
      pepper: { usdMonthly: 3.99, usdAnnual: 38 },
      chicken: { usdMonthly: 7.99, usdAnnual: 77 }
    },
    catteryOwner: {
      truffle: { usdMonthly: 15, usdAnnual: 144 },
      pepper: { usdMonthly: 29, usdAnnual: 278 },
      chicken: { usdMonthly: 59, usdAnnual: 566 }
    }
  };

  /**
   * Get currency for a specific country code
   */
  static getCurrencyForCountry(countryCode: string): CurrencyInfo {
    const regional = this.REGIONAL_CURRENCIES.find(r => r.countryCode === countryCode);
    
    if (regional) {
      return regional.currency;
    }

    // Default to USD for unsupported countries
    return { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 };
  }

  /**
   * Fetch live exchange rates (with fallback to static rates)
   */
  static async getExchangeRates(): Promise<Map<string, number>> {
    const now = Date.now();
    
    // Return cached rates if still valid
    if (this.cachedRates.size > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedRates;
    }

    try {
      // Try to fetch live rates (using a free API)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (response.ok) {
        const data = await response.json();
        const rates = new Map<string, number>();
        
        // Store rates for our supported currencies
        this.REGIONAL_CURRENCIES.forEach(regional => {
          const rate = data.rates[regional.currency.code];
          if (rate) {
            rates.set(regional.currency.code, rate);
          } else {
            // Fallback to static rate
            rates.set(regional.currency.code, regional.currency.rate);
          }
        });
        
        this.cachedRates = rates;
        this.lastFetch = now;
        return rates;
      }
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using static rates:', error);
    }

    // Fallback to static rates
    const staticRates = new Map<string, number>();
    this.REGIONAL_CURRENCIES.forEach(regional => {
      staticRates.set(regional.currency.code, regional.currency.rate);
    });
    
    this.cachedRates = staticRates;
    this.lastFetch = now;
    return staticRates;
  }

  /**
   * Convert USD amount to target currency
   */
  static async convertFromUSD(usdAmount: number, targetCurrency: string): Promise<number> {
    if (targetCurrency === 'USD') {
      return usdAmount;
    }

    const rates = await this.getExchangeRates();
    const rate = rates.get(targetCurrency) || 1;
    
    return Math.round(usdAmount * rate * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Format price with proper currency symbol and local formatting
   */
  static formatPrice(amount: number, currency: CurrencyInfo): string {
    const roundedAmount = Math.round(amount);
    
    // Handle different currency formatting styles
    switch (currency.code) {
      case 'EUR':
        return `${roundedAmount}€`;
      case 'GBP':
        return `£${roundedAmount}`;
      case 'JPY':
        return `¥${roundedAmount}`;
      default:
        return `${currency.symbol}${roundedAmount}`;
    }
  }

  /**
   * Get localized pricing for a specific tier and country
   */
  static async getLocalizedPricing(
    userType: 'catParent' | 'catteryOwner',
    tier: string,
    countryCode: string
  ): Promise<{ monthly: string; annual: string; currency: CurrencyInfo; savings: string }> {
    const currency = this.getCurrencyForCountry(countryCode);
    
    // Get USD pricing based on user type and tier
    let usdPricing: PricingTier;
    
    if (userType === 'catParent') {
      usdPricing = this.PRICING_TIERS.catParent[tier as keyof typeof this.PRICING_TIERS.catParent];
    } else {
      usdPricing = this.PRICING_TIERS.catteryOwner[tier as keyof typeof this.PRICING_TIERS.catteryOwner];
    }

    if (!usdPricing) {
      throw new Error(`Invalid pricing tier: ${tier} for user type: ${userType}`);
    }

    // Convert to local currency
    const monthlyPrice = await this.convertFromUSD(usdPricing.usdMonthly, currency.code);
    const annualPrice = await this.convertFromUSD(usdPricing.usdAnnual, currency.code);
    
    // Calculate savings
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - annualPrice;

    return {
      monthly: this.formatPrice(monthlyPrice, currency),
      annual: this.formatPrice(annualPrice, currency),
      currency,
      savings: this.formatPrice(savings, currency)
    };
  }

  /**
   * Get realistic cattery pricing ranges by region (per stay)
   * Based on average cattery prices per night × typical 3-7 day stays
   */
  private static getRegionalCatteryPricing(countryCode: string) {
    // Realistic cattery pricing per night by region
    const regionalPricing = {
      'US': { low: 35, mid: 55, high: 85 }, // USD per night
      'GB': { low: 25, mid: 40, high: 65 }, // GBP per night  
      'AU': { low: 40, mid: 60, high: 90 }, // AUD per night
      'NZ': { low: 45, mid: 60, high: 85 }, // NZD per night
      'CA': { low: 40, mid: 55, high: 80 }, // CAD per night
      'SG': { low: 50, mid: 75, high: 120 }, // SGD per night
      'EU': { low: 30, mid: 50, high: 75 }, // EUR per night
      'DEFAULT': { low: 35, mid: 55, high: 85 } // USD equivalent
    };

    return regionalPricing[countryCode] || regionalPricing['DEFAULT'];
  }

  /**
   * Get localized budget ranges for cat parents based on realistic cattery pricing PER NIGHT
   */
  static async getLocalizedBudgetRanges(countryCode: string): Promise<string[]> {
    const currency = this.getCurrencyForCountry(countryCode);
    const pricing = this.getRegionalCatteryPricing(countryCode);
    
    // Calculate ranges based on per-night pricing (as the question asks about per night rates)
    // Using native currency rates, no conversion needed for supported regions
    const ranges = [
      {
        label: `Under ${currency.symbol}${Math.round(pricing.low * 0.8)}`,
        description: 'Budget catteries per night'
      },
      {
        label: `${currency.symbol}${Math.round(pricing.low * 0.8)}-${Math.round(pricing.mid)}`,
        description: 'Budget to standard catteries per night'
      },
      {
        label: `${currency.symbol}${Math.round(pricing.mid)}-${Math.round(pricing.high)}`,
        description: 'Standard to premium catteries per night'
      },
      {
        label: `${currency.symbol}${Math.round(pricing.high)}-${Math.round(pricing.high * 1.2)}`,
        description: 'Premium catteries per night'
      },
      {
        label: `Over ${currency.symbol}${Math.round(pricing.high * 1.2)}`,
        description: 'Luxury catteries per night'
      }
    ];

    return ranges.map(range => range.label);
  }

  /**
   * Get localized marketing spend ranges for cattery owners
   * Adjusted to reflect regional business costs and cattery economics
   */
  static async getLocalizedMarketingRanges(countryCode: string): Promise<string[]> {
    const currency = this.getCurrencyForCountry(countryCode);
    
    // Regional marketing spend ranges based on local business costs
    const regionalMarketing = {
      'US': [0, 75, 200, 400], // Higher marketing costs in competitive US market
      'GB': [0, 50, 150, 300], // GBP - moderate marketing costs
      'AU': [0, 80, 180, 350], // AUD - higher costs for digital marketing
      'NZ': [0, 60, 140, 280], // NZD - smaller market, lower absolute costs
      'CA': [0, 70, 160, 320], // CAD - similar to US but slightly lower
      'SG': [0, 100, 250, 500], // SGD - premium market, higher marketing costs
      'EU': [0, 60, 150, 300], // EUR - average European costs
      'DEFAULT': [0, 75, 200, 400] // USD equivalent
    };

    const amounts = regionalMarketing[countryCode] || regionalMarketing['DEFAULT'];
    
    return [
      'Nothing',
      `Under ${this.formatPrice(amounts[1], currency)}`,
      `${this.formatPrice(amounts[1], currency)}-${this.formatPrice(amounts[2], currency)}`,
      `${this.formatPrice(amounts[2], currency)}-${this.formatPrice(amounts[3], currency)}`,
      `Over ${this.formatPrice(amounts[3], currency)}`
    ];
  }

  /**
   * Get all supported currencies
   */
  static getSupportedCurrencies(): CurrencyInfo[] {
    return this.REGIONAL_CURRENCIES.map(r => r.currency);
  }

  /**
   * Check if a country has currency support
   */
  static isCurrencySupported(countryCode: string): boolean {
    return this.REGIONAL_CURRENCIES.some(r => r.countryCode === countryCode);
  }

  /**
   * Get currency display name for UI
   */
  static getCurrencyDisplayName(countryCode: string): string {
    const currency = this.getCurrencyForCountry(countryCode);
    return `${currency.name} (${currency.code})`;
  }

  /**
   * Get regional cattery pricing insights for display
   */
  static getRegionalPricingInsights(countryCode: string): {
    averagePerNight: string;
    typicalStayRange: string;
    marketLevel: string;
  } {
    const currency = this.getCurrencyForCountry(countryCode);
    const pricing = this.getRegionalCatteryPricing(countryCode);
    
    const insights = {
      'US': { marketLevel: 'Competitive', stayDays: '4-6' },
      'GB': { marketLevel: 'Established', stayDays: '3-5' },
      'AU': { marketLevel: 'Growing', stayDays: '4-7' },
      'NZ': { marketLevel: 'Emerging', stayDays: '3-6' },
      'CA': { marketLevel: 'Competitive', stayDays: '4-6' },
      'SG': { marketLevel: 'Premium', stayDays: '3-5' },
      'EU': { marketLevel: 'Established', stayDays: '3-5' },
      'DEFAULT': { marketLevel: 'Competitive', stayDays: '4-6' }
    };

    const regionInsights = insights[countryCode] || insights['DEFAULT'];
    
    return {
      averagePerNight: `${this.formatPrice(pricing.mid, currency)}/night`,
      typicalStayRange: `${regionInsights.stayDays} days`,
      marketLevel: regionInsights.marketLevel
    };
  }
}

export type { CurrencyInfo, RegionalCurrency, PricingTier };