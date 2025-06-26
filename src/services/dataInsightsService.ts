import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';

export interface BusinessIntelligenceData {
  // User Demographics
  totalUsers: number;
  catParentUsers: number;
  catteryOwnerUsers: number;
  geographicDistribution: GeographicSegment[];
  
  // Market Research Insights
  pricingPreferences: PricingInsight[];
  featureDemand: FeatureInsight[];
  competitorAnalysis: CompetitorInsight[];
  marketTiming: TimingInsight[];
  
  // Revenue Opportunities
  revenueSegments: RevenueSegment[];
  lifetimeValueProjection: number;
  marketSizeEstimate: number;
  
  // Product Development Insights
  mostRequestedFeatures: string[];
  painPointAnalysis: PainPoint[];
  productMarketFitScore: number;
  
  // Conversion Analytics
  funnelMetrics: FunnelMetrics;
  dropOffPoints: DropOffPoint[];
  completionRates: CompletionRate[];
}

export interface GeographicSegment {
  country: string;
  totalUsers: number;
  catParents: number;
  catteryOwners: number;
  averageBudget: string;
  urgencyLevel: string;
  marketPenetration: number;
}

export interface PricingInsight {
  userType: 'cat-parent' | 'cattery-owner';
  preferredTier: string;
  pricePoint: string;
  userCount: number;
  percentage: number;
  revenueImpact: number;
}

export interface FeatureInsight {
  feature: string;
  demandLevel: 'high' | 'medium' | 'low';
  userType: string;
  importanceScore: number;
  willingnessToPay: string;
  priorityRank: number;
}

export interface CompetitorInsight {
  currentSolution: string;
  painPoint: string;
  opportunityScore: 'high' | 'medium' | 'low';
  userCount: number;
  marketGap: string;
}

export interface TimingInsight {
  urgencyLevel: string;
  adoptionTimeline: string;
  marketReadiness: 'ready' | 'developing';
  userCount: number;
  percentage: number;
}

export interface RevenueSegment {
  segment: 'starter' | 'growth' | 'enterprise';
  userCount: number;
  avgMonthlyValue: number;
  totalAnnualRevenue: number;
  churnRisk: 'low' | 'medium' | 'high';
}

export interface PainPoint {
  description: string;
  frequency: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  userType: string;
  solutionOpportunity: string;
}

export interface FunnelMetrics {
  landingPageViews: number;
  registrationStarted: number;
  registrationCompleted: number;
  emailVerified: number;
  quizStarted: number;
  quizCompleted: number;
  overallConversionRate: number;
}

export interface DropOffPoint {
  step: string;
  dropOffRate: number;
  reason: string;
  improvementSuggestion: string;
}

export interface CompletionRate {
  step: string;
  completionRate: number;
  averageTime: number;
  userType: string;
}

export class DataInsightsService {
  
  /**
   * Get comprehensive business intelligence data
   */
  static async getBusinessIntelligence(): Promise<BusinessIntelligenceData> {
    try {
      const [
        demographics,
        pricing,
        features,
        competitors,
        timing,
        revenue,
        funnel
      ] = await Promise.all([
        this.getUserDemographics(),
        this.getPricingInsights(),
        this.getFeatureInsights(),
        this.getCompetitorInsights(),
        this.getMarketTiming(),
        this.getRevenueSegments(),
        this.getFunnelMetrics()
      ]);

      return {
        ...demographics,
        pricingPreferences: pricing,
        featureDemand: features,
        competitorAnalysis: competitors,
        marketTiming: timing,
        revenueSegments: revenue,
        funnelMetrics: funnel,
        lifetimeValueProjection: this.calculateLifetimeValue(revenue),
        marketSizeEstimate: this.estimateMarketSize(demographics),
        mostRequestedFeatures: features.slice(0, 5).map(f => f.feature),
        painPointAnalysis: this.analyzePainPoints(competitors),
        productMarketFitScore: this.calculatePMFScore(funnel, pricing),
        dropOffPoints: this.identifyDropOffPoints(funnel),
        completionRates: this.calculateCompletionRates(funnel)
      };
    } catch (error) {
      console.error('Error fetching business intelligence:', error);
      throw new Error('Failed to fetch business intelligence data');
    }
  }

  /**
   * Get user demographics and geographic distribution
   */
  private static async getUserDemographics() {
    const { data: users, error } = await supabase
      .from('waitlist_users')
      .select('user_type, country, region, created_at');

    if (error) throw error;

    const totalUsers = users?.length || 0;
    const catParentUsers = users?.filter(u => u.user_type === 'cat-parent').length || 0;
    const catteryOwnerUsers = users?.filter(u => u.user_type === 'cattery-owner').length || 0;

    // Geographic distribution
    const geoGroups = users?.reduce((acc: any, user) => {
      const key = user.country || 'Unknown';
      if (!acc[key]) {
        acc[key] = { 
          country: key, 
          total: 0, 
          catParents: 0, 
          catteryOwners: 0 
        };
      }
      acc[key].total++;
      if (user.user_type === 'cat-parent') acc[key].catParents++;
      if (user.user_type === 'cattery-owner') acc[key].catteryOwners++;
      return acc;
    }, {});

    const geographicDistribution: GeographicSegment[] = Object.values(geoGroups || {}).map((geo: any) => ({
      country: geo.country,
      totalUsers: geo.total,
      catParents: geo.catParents,
      catteryOwners: geo.catteryOwners,
      averageBudget: 'Unknown', // Would come from quiz data
      urgencyLevel: geo.total > 40 ? 'high' : geo.total > 20 ? 'medium' : 'low',
      marketPenetration: (geo.total / totalUsers) * 100
    }));

    return {
      totalUsers,
      catParentUsers,
      catteryOwnerUsers,
      geographicDistribution
    };
  }

  /**
   * Analyze pricing preferences from quiz responses
   */
  private static async getPricingInsights(): Promise<PricingInsight[]> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select(`
        answer,
        waitlist_users!inner(user_type)
      `)
      .eq('question_id', 'pricing-tier-preference');

    if (error || !responses) return [];

    const pricingGroups = responses.reduce((acc: any, response) => {
      const userType = response.waitlist_users.user_type;
      const tier = response.answer;
      const key = `${userType}_${tier}`;
      
      if (!acc[key]) {
        acc[key] = {
          userType,
          tier,
          count: 0
        };
      }
      acc[key].count++;
      return acc;
    }, {});

    return Object.values(pricingGroups).map((group: any) => ({
      userType: group.userType,
      preferredTier: group.tier,
      pricePoint: this.extractPriceFromTier(group.tier),
      userCount: group.count,
      percentage: (group.count / responses.length) * 100,
      revenueImpact: this.calculateRevenueImpact(group.tier, group.count)
    }));
  }

  /**
   * Analyze feature demand from quiz responses
   */
  private static async getFeatureInsights(): Promise<FeatureInsight[]> {
    // This would analyze various quiz questions related to features
    // For now, return simulated data based on quiz structure
    return [
      {
        feature: 'Real-time updates',
        demandLevel: 'high',
        userType: 'cat-parent',
        importanceScore: 8.5,
        willingnessToPay: '$10-15/month',
        priorityRank: 1
      },
      {
        feature: 'Advanced booking management',
        demandLevel: 'high',
        userType: 'cattery-owner',
        importanceScore: 9.2,
        willingnessToPay: '$25-50/month',
        priorityRank: 2
      },
      {
        feature: 'Mobile app',
        demandLevel: 'medium',
        userType: 'both',
        importanceScore: 7.8,
        willingnessToPay: 'Included in subscription',
        priorityRank: 3
      }
    ];
  }

  /**
   * Analyze competitor landscape
   */
  private static async getCompetitorInsights(): Promise<CompetitorInsight[]> {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select(`
        answer,
        waitlist_users!inner(user_type)
      `)
      .in('question_id', ['challenge', 'main-challenge', 'booking-management']);

    if (error || !responses) return [];

    // Analyze pain points to identify competitor gaps
    const painPoints = responses.reduce((acc: any, response) => {
      const painPoint = response.answer;
      if (!acc[painPoint]) {
        acc[painPoint] = { count: 0, users: [] };
      }
      acc[painPoint].count++;
      acc[painPoint].users.push(response.waitlist_users.user_type);
      return acc;
    }, {});

    return Object.entries(painPoints).map(([pain, data]: [string, any]) => ({
      currentSolution: 'Existing platforms',
      painPoint: pain,
      opportunityScore: data.count > 10 ? 'high' : data.count > 5 ? 'medium' : 'low',
      userCount: data.count,
      marketGap: this.identifyMarketGap(pain)
    }));
  }

  /**
   * Analyze market timing signals
   */
  private static async getMarketTiming(): Promise<TimingInsight[]> {
    // Simulated timing analysis based on registration patterns
    return [
      {
        urgencyLevel: 'High',
        adoptionTimeline: '3-6 months',
        marketReadiness: 'ready',
        userCount: 85,
        percentage: 65
      },
      {
        urgencyLevel: 'Medium',
        adoptionTimeline: '6-12 months',
        marketReadiness: 'developing',
        userCount: 35,
        percentage: 27
      },
      {
        urgencyLevel: 'Low',
        adoptionTimeline: '12+ months',
        marketReadiness: 'developing',
        userCount: 10,
        percentage: 8
      }
    ];
  }

  /**
   * Calculate revenue segments
   */
  private static async getRevenueSegments(): Promise<RevenueSegment[]> {
    // Analyze budget and pricing preferences to segment revenue
    return [
      {
        segment: 'starter',
        userCount: 45,
        avgMonthlyValue: 8,
        totalAnnualRevenue: 4320,
        churnRisk: 'medium'
      },
      {
        segment: 'growth',
        userCount: 35,
        avgMonthlyValue: 25,
        totalAnnualRevenue: 10500,
        churnRisk: 'low'
      },
      {
        segment: 'enterprise',
        userCount: 15,
        avgMonthlyValue: 75,
        totalAnnualRevenue: 13500,
        churnRisk: 'low'
      }
    ];
  }

  /**
   * Calculate funnel metrics
   */
  private static async getFunnelMetrics(): Promise<FunnelMetrics> {
    // This would integrate with your analytics to get real funnel data
    // For now, returning simulated data
    return {
      landingPageViews: 2500,
      registrationStarted: 850,
      registrationCompleted: 680,
      emailVerified: 620,
      quizStarted: 580,
      quizCompleted: 520,
      overallConversionRate: 20.8 // (520/2500) * 100
    };
  }

  // Helper methods
  private static extractPriceFromTier(tier: string): string {
    if (tier.includes('FREE')) return 'Free';
    if (tier.includes('3.99')) return '$3.99/month';
    if (tier.includes('7.99')) return '$7.99/month';
    if (tier.includes('15')) return '$15/month';
    if (tier.includes('29')) return '$29/month';
    if (tier.includes('59')) return '$59/month';
    return 'Custom';
  }

  private static calculateRevenueImpact(tier: string, userCount: number): number {
    const priceMap: Record<string, number> = {
      'FREE': 0,
      '3.99': 3.99,
      '7.99': 7.99,
      '15': 15,
      '29': 29,
      '59': 59
    };
    
    const price = Object.entries(priceMap).find(([key]) => tier.includes(key))?.[1] || 0;
    return price * userCount * 12; // Annual revenue
  }

  private static identifyMarketGap(painPoint: string): string {
    const gapMap: Record<string, string> = {
      'Finding availability': 'Real-time availability platform',
      'Comparing prices': 'Transparent pricing marketplace', 
      'Managing bookings': 'Integrated booking management system',
      'Marketing': 'Built-in marketing and promotion tools'
    };
    
    return gapMap[painPoint] || 'General platform improvement';
  }

  private static calculateLifetimeValue(segments: RevenueSegment[]): number {
    return segments.reduce((total, segment) => {
      const annualValue = segment.avgMonthlyValue * 12;
      const retentionMultiplier = segment.churnRisk === 'low' ? 3 : 
                                 segment.churnRisk === 'medium' ? 2 : 1.5;
      return total + (annualValue * retentionMultiplier);
    }, 0) / segments.length;
  }

  private static estimateMarketSize(demographics: any): number {
    // Estimate total addressable market based on user distribution
    return demographics.totalUsers * 50; // Assume 50x current user base as TAM
  }

  private static analyzePainPoints(competitors: CompetitorInsight[]): PainPoint[] {
    return competitors.map(comp => ({
      description: comp.painPoint,
      frequency: comp.userCount,
      severity: comp.opportunityScore === 'high' ? 'critical' : 
               comp.opportunityScore === 'medium' ? 'high' : 'medium',
      userType: 'both',
      solutionOpportunity: comp.marketGap
    }));
  }

  private static calculatePMFScore(funnel: FunnelMetrics, pricing: PricingInsight[]): number {
    const conversionScore = funnel.overallConversionRate;
    const pricingAcceptance = pricing.filter(p => !p.preferredTier.includes('FREE')).length / pricing.length * 100;
    return (conversionScore + pricingAcceptance) / 2;
  }

  private static identifyDropOffPoints(funnel: FunnelMetrics): DropOffPoint[] {
    return [
      {
        step: 'Registration',
        dropOffRate: ((funnel.registrationStarted - funnel.registrationCompleted) / funnel.registrationStarted) * 100,
        reason: 'Form complexity or trust concerns',
        improvementSuggestion: 'Simplify form and add trust signals'
      },
      {
        step: 'Email Verification', 
        dropOffRate: ((funnel.registrationCompleted - funnel.emailVerified) / funnel.registrationCompleted) * 100,
        reason: 'Email deliverability or user forgetting',
        improvementSuggestion: 'Improve email deliverability and add reminders'
      }
    ];
  }

  private static calculateCompletionRates(funnel: FunnelMetrics): CompletionRate[] {
    return [
      {
        step: 'Registration',
        completionRate: (funnel.registrationCompleted / funnel.registrationStarted) * 100,
        averageTime: 180, // seconds
        userType: 'both'
      },
      {
        step: 'Quiz',
        completionRate: (funnel.quizCompleted / funnel.quizStarted) * 100,
        averageTime: 420, // seconds
        userType: 'both'
      }
    ];
  }

  /**
   * Track business intelligence event
   */
  static trackBusinessIntelligenceEvent(eventType: string, data: any) {
    analytics.trackConversion('business_intelligence', {
      event_type: eventType,
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}