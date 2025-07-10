import { supabase } from '../lib/supabase';

export interface QuizAnalytics {
  // Pricing Analytics
  pricingPreferences: PricingPreference[];
  revenueProjections: RevenueProjection[];
  budgetDistribution: BudgetDistribution[];
  
  // Geographic Analytics
  geographicData: GeographicData[];
  regionRevenueMap: RegionRevenue[];
  
  // User Segment Analytics
  userSegments: UserSegment[];
  painPointAnalysis: PainPoint[];
  featureInterest: FeatureInterest[];
  
  // Market Intelligence
  marketSizing: MarketSize[];
  competitorAnalysis: CompetitorInsight[];
  
  // Conversion Analytics
  conversionFunnel: ConversionStep[];
  qualificationScores: QualificationScore[];
}

export interface PricingPreference {
  userType: 'cat-parent' | 'cattery-owner';
  tier: string;
  count: number;
  percentage: number;
  averageWillingness: number;
  region?: string;
  currency: string;
}

export interface RevenueProjection {
  userType: 'cat-parent' | 'cattery-owner';
  tier: string;
  region: string;
  monthlyUsers: number;
  monthlyRevenue: number;
  annualRevenue: number;
  lifetime: number;
}

export interface BudgetDistribution {
  userType: 'cat-parent' | 'cattery-owner';
  budgetRange: string;
  count: number;
  percentage: number;
  averageBudget: number;
  region: string;
}

export interface GeographicData {
  country: string;
  countryCode: string;
  totalUsers: number;
  catParents: number;
  catteryOwners: number;
  averageWillingness: number;
  topTier: string;
  revenueOpportunity: number;
}

export interface RegionRevenue {
  region: string;
  potentialMonthly: number;
  potentialAnnual: number;
  userCount: number;
  penetrationRate: number;
  marketMaturity: 'early' | 'growth' | 'mature';
}

export interface UserSegment {
  name: string;
  userType: 'cat-parent' | 'cattery-owner';
  characteristics: string[];
  size: number;
  revenueOpportunity: number;
  priority: 'high' | 'medium' | 'low';
}

export interface PainPoint {
  issue: string;
  userType: 'cat-parent' | 'cattery-owner';
  frequency: number;
  percentage: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  region: string;
}

export interface FeatureInterest {
  feature: string;
  userType: 'cat-parent' | 'cattery-owner';
  interestLevel: number;
  willingnessToPay: number;
  priority: number;
}

export interface MarketSize {
  region: string;
  userType: 'cat-parent' | 'cattery-owner';
  totalAddressableMarket: number;
  serviceableMarket: number;
  currentPenetration: number;
  growthPotential: number;
}

export interface CompetitorInsight {
  currentSolution: string;
  userType: 'cat-parent' | 'cattery-owner';
  usage: number;
  satisfaction: number;
  switchingWillingness: number;
  pricePoint: number;
}

export interface ConversionStep {
  step: string;
  users: number;
  conversionRate: number;
  dropOffReasons: string[];
}

export interface QualificationScore {
  userType: 'cat-parent' | 'cattery-owner';
  scoreRange: string;
  count: number;
  tier: string;
  revenue: number;
}

export class QuizAnalyticsService {
  /**
   * Get comprehensive quiz analytics
   */
  static async getQuizAnalytics(): Promise<QuizAnalytics> {
    try {
      const [
        pricingData,
        geographicData,
        segmentData,
        marketData,
        conversionData
      ] = await Promise.all([
        this.getPricingAnalytics(),
        this.getGeographicAnalytics(),
        this.getUserSegmentAnalytics(),
        this.getMarketIntelligence(),
        this.getConversionAnalytics()
      ]);

      return {
        ...pricingData,
        ...geographicData,
        ...segmentData,
        ...marketData,
        ...conversionData
      };
    } catch (error) {
      console.error('Failed to fetch quiz analytics:', error);
      throw new Error('Unable to load analytics data');
    }
  }

  /**
   * Get pricing preferences and revenue projections
   */
  static async getPricingAnalytics(): Promise<{
    pricingPreferences: PricingPreference[];
    revenueProjections: RevenueProjection[];
    budgetDistribution: BudgetDistribution[];
  }> {
    const { data: pricingData, error } = await supabase.rpc('get_pricing_analytics');
    
    if (error) throw error;

    // Process pricing preferences
    const pricingPreferences = await this.processPricingPreferences(pricingData);
    
    // Calculate revenue projections
    const revenueProjections = await this.calculateRevenueProjections(pricingPreferences);
    
    // Analyze budget distribution
    const budgetDistribution = await this.analyzeBudgetDistribution();

    return {
      pricingPreferences,
      revenueProjections,
      budgetDistribution
    };
  }

  /**
   * Get geographic distribution and regional insights
   */
  static async getGeographicAnalytics(): Promise<{
    geographicData: GeographicData[];
    regionRevenueMap: RegionRevenue[];
  }> {
    const { data: geoData, error } = await supabase.rpc('get_geographic_analytics');
    
    if (error) throw error;

    const geographicData = geoData.map((region: any) => ({
      country: region.country,
      countryCode: region.country_code,
      totalUsers: region.total_users,
      catParents: region.cat_parents,
      catteryOwners: region.cattery_owners,
      averageWillingness: region.avg_willingness,
      topTier: region.top_tier,
      revenueOpportunity: region.revenue_opportunity
    }));

    const regionRevenueMap = await this.calculateRegionalRevenue(geographicData);

    return {
      geographicData,
      regionRevenueMap
    };
  }

  /**
   * Analyze user segments and pain points
   */
  static async getUserSegmentAnalytics(): Promise<{
    userSegments: UserSegment[];
    painPointAnalysis: PainPoint[];
    featureInterest: FeatureInterest[];
  }> {
    const { data: segmentData, error } = await supabase.rpc('get_user_segment_analytics');
    
    if (error) throw error;

    const userSegments = this.identifyUserSegments(segmentData);
    const painPointAnalysis = await this.analyzePainPoints();
    const featureInterest = await this.analyzeFeatureInterest();

    return {
      userSegments,
      painPointAnalysis,
      featureInterest
    };
  }

  /**
   * Get market intelligence and competitive insights
   */
  static async getMarketIntelligence(): Promise<{
    marketSizing: MarketSize[];
    competitorAnalysis: CompetitorInsight[];
  }> {
    const marketSizing = await this.calculateMarketSizing();
    const competitorAnalysis = await this.analyzeCompetitorInsights();

    return {
      marketSizing,
      competitorAnalysis
    };
  }

  /**
   * Analyze conversion funnel and qualification scores
   */
  static async getConversionAnalytics(): Promise<{
    conversionFunnel: ConversionStep[];
    qualificationScores: QualificationScore[];
  }> {
    const conversionFunnel = await this.analyzeConversionFunnel();
    const qualificationScores = await this.analyzeQualificationScores();

    return {
      conversionFunnel,
      qualificationScores
    };
  }

  /**
   * Process pricing preferences from raw data
   */
  private static async processPricingPreferences(data: any[]): Promise<PricingPreference[]> {
    // Group by user type and pricing tier
    const preferences = data.reduce((acc: any[], item: any) => {
      const existing = acc.find(p => 
        p.userType === item.user_type && 
        p.tier === item.pricing_tier &&
        p.region === item.country
      );

      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          userType: item.user_type,
          tier: item.pricing_tier,
          count: 1,
          region: item.country,
          currency: item.currency || 'USD'
        });
      }

      return acc;
    }, []);

    // Calculate percentages and averages
    return preferences.map(pref => ({
      ...pref,
      percentage: (pref.count / data.length) * 100,
      averageWillingness: this.calculateAverageWillingness(pref.tier, pref.userType)
    }));
  }

  /**
   * Calculate revenue projections based on pricing preferences
   */
  private static async calculateRevenueProjections(preferences: PricingPreference[]): Promise<RevenueProjection[]> {
    const tierPricing = {
      catParent: { pepper: 3.99, chicken: 7.99 },
      catteryOwner: { truffle: 15, pepper: 29, chicken: 59 }
    };

    return preferences.map(pref => {
      const monthlyPrice = tierPricing[pref.userType as keyof typeof tierPricing]?.[pref.tier as keyof any] || 0;
      const monthlyRevenue = pref.count * monthlyPrice;
      
      return {
        userType: pref.userType,
        tier: pref.tier,
        region: pref.region || 'Unknown',
        monthlyUsers: pref.count,
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        lifetime: monthlyRevenue * 24 // Assuming 24 month LTV
      };
    });
  }

  /**
   * Analyze budget distribution
   */
  private static async analyzeBudgetDistribution(): Promise<BudgetDistribution[]> {
    const { data, error } = await supabase.rpc('get_budget_distribution');
    
    if (error) throw error;

    return data.map((item: any) => ({
      userType: item.user_type,
      budgetRange: item.budget_range,
      count: item.count,
      percentage: item.percentage,
      averageBudget: item.avg_budget,
      region: item.country
    }));
  }

  /**
   * Calculate regional revenue opportunities
   */
  private static async calculateRegionalRevenue(geoData: GeographicData[]): Promise<RegionRevenue[]> {
    return geoData.map(region => {
      const penetrationRate = (region.totalUsers / 1000) * 100; // Assuming 1000 is market size
      const marketMaturity = penetrationRate > 10 ? 'mature' : penetrationRate > 5 ? 'growth' : 'early';
      
      return {
        region: region.country,
        potentialMonthly: region.revenueOpportunity,
        potentialAnnual: region.revenueOpportunity * 12,
        userCount: region.totalUsers,
        penetrationRate,
        marketMaturity
      };
    });
  }

  /**
   * Identify user segments based on behavior patterns
   */
  private static identifyUserSegments(data: any[]): UserSegment[] {
    // This would analyze patterns and create segments
    // For now, returning example segments
    return [
      {
        name: 'Premium Cat Parents',
        userType: 'cat-parent',
        characteristics: ['High budget', 'Frequent usage', 'Convenience focused'],
        size: 150,
        revenueOpportunity: 15000,
        priority: 'high'
      },
      {
        name: 'Growth Catteries',
        userType: 'cattery-owner',
        characteristics: ['Medium capacity', 'Marketing focused', 'Tech adoption'],
        size: 80,
        revenueOpportunity: 25000,
        priority: 'high'
      }
    ];
  }

  /**
   * Analyze pain points by frequency and severity
   */
  private static async analyzePainPoints(): Promise<PainPoint[]> {
    const { data, error } = await supabase.rpc('get_pain_point_analysis');
    
    if (error) throw error;

    return data.map((item: any) => ({
      issue: item.pain_point,
      userType: item.user_type,
      frequency: item.frequency,
      percentage: item.percentage,
      severity: item.severity,
      region: item.country
    }));
  }

  /**
   * Analyze feature interest levels
   */
  private static async analyzeFeatureInterest(): Promise<FeatureInterest[]> {
    const { data, error } = await supabase.rpc('get_feature_interest');
    
    if (error) throw error;

    return data.map((item: any) => ({
      feature: item.feature_name,
      userType: item.user_type,
      interestLevel: item.interest_level,
      willingnessToPay: item.willingness_to_pay,
      priority: item.priority_score
    }));
  }

  /**
   * Calculate market sizing estimates
   */
  private static async calculateMarketSizing(): Promise<MarketSize[]> {
    // This would use external market data + our survey data
    return [
      {
        region: 'New Zealand',
        userType: 'cat-parent',
        totalAddressableMarket: 500000,
        serviceableMarket: 50000,
        currentPenetration: 0.1,
        growthPotential: 85
      }
    ];
  }

  /**
   * Analyze competitor insights
   */
  private static async analyzeCompetitorInsights(): Promise<CompetitorInsight[]> {
    const { data, error } = await supabase.rpc('get_competitor_analysis');
    
    if (error) throw error;

    return data.map((item: any) => ({
      currentSolution: item.current_solution,
      userType: item.user_type,
      usage: item.usage_frequency,
      satisfaction: item.satisfaction_score,
      switchingWillingness: item.switching_willingness,
      pricePoint: item.current_price_point
    }));
  }

  /**
   * Analyze conversion funnel
   */
  private static async analyzeConversionFunnel(): Promise<ConversionStep[]> {
    const { data, error } = await supabase.rpc('get_conversion_funnel');
    
    if (error) throw error;

    return data.map((item: any) => ({
      step: item.step_name,
      users: item.user_count,
      conversionRate: item.conversion_rate,
      dropOffReasons: item.drop_off_reasons || []
    }));
  }

  /**
   * Analyze qualification scores
   */
  private static async analyzeQualificationScores(): Promise<QualificationScore[]> {
    const { data, error } = await supabase.rpc('get_qualification_scores');
    
    if (error) throw error;

    return data.map((item: any) => ({
      userType: item.user_type,
      scoreRange: item.score_range,
      count: item.count,
      tier: item.predicted_tier,
      revenue: item.revenue_potential
    }));
  }

  /**
   * Calculate average willingness to pay for a tier
   */
  private static calculateAverageWillingness(tier: string, userType: string): number {
    const pricing = {
      'cat-parent': { pepper: 3.99, chicken: 7.99 },
      'cattery-owner': { truffle: 15, pepper: 29, chicken: 59 }
    };

    return pricing[userType as keyof typeof pricing]?.[tier as keyof any] || 0;
  }

  /**
   * Export analytics data to CSV
   */
  static async exportToCSV(dataType: string): Promise<string> {
    const analytics = await this.getQuizAnalytics();
    
    // Convert to CSV format based on dataType
    switch (dataType) {
      case 'pricing':
        return this.convertToCSV(analytics.pricingPreferences);
      case 'geographic':
        return this.convertToCSV(analytics.geographicData);
      case 'segments':
        return this.convertToCSV(analytics.userSegments);
      default:
        return this.convertToCSV(analytics.pricingPreferences);
    }
  }

  /**
   * Convert data to CSV format
   */
  private static convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => `"${value}"`).join(',')
    ).join('\n');
    
    return `${headers}\n${rows}`;
  }
}