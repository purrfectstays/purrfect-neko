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
   * Get localized budget ranges for cat parents
   */
  static async getLocalizedBudgetRanges(countryCode: string): Promise<string[]> {
    const currency = this.getCurrencyForCountry(countryCode);
    
    // USD budget ranges
    const usdRanges = [
      { label: 'Under $50', max: 50 },
      { label: '$50-100', min: 50, max: 100 },
      { label: '$100-200', min: 100, max: 200 },
      { label: '$200-300', min: 200, max: 300 },
      { label: 'Over $300', min: 300 }
    ];

    const localizedRanges = await Promise.all(
      usdRanges.map(async (range) => {
        if (range.max && !range.min) {
          // "Under X" format
          const localAmount = await this.convertFromUSD(range.max, currency.code);
          return `Under ${this.formatPrice(localAmount, currency)}`;
        } else if (range.min && range.max) {
          // "X-Y" format
          const localMin = await this.convertFromUSD(range.min, currency.code);
          const localMax = await this.convertFromUSD(range.max, currency.code);
          return `${this.formatPrice(localMin, currency)}-${this.formatPrice(localMax, currency)}`;
        } else if (range.min && !range.max) {
          // "Over X" format
          const localAmount = await this.convertFromUSD(range.min, currency.code);
          return `Over ${this.formatPrice(localAmount, currency)}`;
        }
        return range.label; // Fallback
      })
    );

    return localizedRanges;
  }

  /**
   * Get localized marketing spend ranges for cattery owners
   */
  static async getLocalizedMarketingRanges(countryCode: string): Promise<string[]> {
    const currency = this.getCurrencyForCountry(countryCode);
    
    // USD marketing spend ranges
    const usdRanges = [
      { label: 'Nothing', amount: 0 },
      { label: 'Under $50', max: 50 },
      { label: '$50-150', min: 50, max: 150 },
      { label: '$150-300', min: 150, max: 300 },
      { label: 'Over $300', min: 300 }
    ];

    const localizedRanges = await Promise.all(
      usdRanges.map(async (range) => {
        if (range.amount === 0) {
          return 'Nothing';
        } else if (range.max && !range.min) {
          const localAmount = await this.convertFromUSD(range.max, currency.code);
          return `Under ${this.formatPrice(localAmount, currency)}`;
        } else if (range.min && range.max) {
          const localMin = await this.convertFromUSD(range.min, currency.code);
          const localMax = await this.convertFromUSD(range.max, currency.code);
          return `${this.formatPrice(localMin, currency)}-${this.formatPrice(localMax, currency)}`;
        } else if (range.min && !range.max) {
          const localAmount = await this.convertFromUSD(range.min, currency.code);
          return `Over ${this.formatPrice(localAmount, currency)}`;
        }
        return range.label;
      })
    );

    return localizedRanges;
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
}

export type { CurrencyInfo, RegionalCurrency, PricingTier };