import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ReferralData {
  id: string;
  referrer_id: string;
  referred_email: string;
  referred_id?: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  positionBoost: number;
  tierLevel: string;
  rewards: Array<{
    threshold: number;
    reward: string;
    achieved: boolean;
  }>;
}

class ReferralService {
  // Generate unique referral code for user
  static generateReferralCode(userId: string): string {
    const shortId = userId.slice(0, 8);
    const timestamp = Date.now().toString(36);
    return `${shortId}-${timestamp}`.toLowerCase();
  }

  // Parse referral URL parameters
  static parseReferralFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
  }

  // Create referral tracking record
  static async createReferral(
    referrerCode: string,
    referredEmail: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Find referrer by code
      const { data: referrer, error: referrerError } = await supabase
        .from('waitlist_users')
        .select('id, email')
        .eq('referral_code', referrerCode)
        .single();

      if (referrerError || !referrer) {
        return { success: false, message: 'Invalid referral code' };
      }

      // Check if email already referred by this user
      const { data: existing, error: existingError } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', referrer.id)
        .eq('referred_email', referredEmail)
        .single();

      if (existing) {
        return { success: true, message: 'Referral already tracked' };
      }

      // Create referral record
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_email: referredEmail,
          status: 'pending'
        });

      if (insertError) {
        console.error('Referral creation error:', insertError);
        return { success: false, message: 'Failed to track referral' };
      }

      return { success: true, message: 'Referral tracked successfully' };
    } catch (error) {
      console.error('Referral service error:', error);
      return { success: false, message: 'Service error' };
    }
  }

  // Complete referral when referred user finishes onboarding
  static async completeReferral(
    referredEmail: string,
    referredUserId: string
  ): Promise<{ success: boolean; positionBoost: number }> {
    try {
      // Find pending referral
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .select('id, referrer_id')
        .eq('referred_email', referredEmail)
        .eq('status', 'pending')
        .single();

      if (referralError || !referral) {
        return { success: false, positionBoost: 0 };
      }

      // Update referral as completed
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'completed',
          referred_id: referredUserId,
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id);

      if (updateError) {
        console.error('Referral completion error:', updateError);
        return { success: false, positionBoost: 0 };
      }

      // Update referrer's referral count and apply position boost
      const { error: referrerUpdateError } = await supabase.rpc(
        'apply_referral_boost',
        {
          user_id: referral.referrer_id,
          boost_amount: 10 // Move up 10 positions per referral
        }
      );

      if (referrerUpdateError) {
        console.error('Referrer boost error:', referrerUpdateError);
      }

      return { success: true, positionBoost: 10 };
    } catch (error) {
      console.error('Complete referral error:', error);
      return { success: false, positionBoost: 0 };
    }
  }

  // Get referral stats for user
  static async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId);

      if (error) {
        console.error('Referral stats error:', error);
        return this.getDefaultStats();
      }

      const totalReferrals = referrals?.length || 0;
      const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;
      const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0;

      const positionBoost = completedReferrals * 10; // 10 positions per completed referral

      // Define reward tiers
      const rewards = [
        { threshold: 1, reward: 'Move up 10 positions', achieved: completedReferrals >= 1 },
        { threshold: 3, reward: 'Premium member group', achieved: completedReferrals >= 3 },
        { threshold: 5, reward: 'Beta testing access', achieved: completedReferrals >= 5 },
        { threshold: 10, reward: 'Advisory board seat', achieved: completedReferrals >= 10 }
      ];

      let tierLevel = 'Starter';
      if (completedReferrals >= 10) tierLevel = 'Ambassador';
      else if (completedReferrals >= 5) tierLevel = 'Beta Tester';
      else if (completedReferrals >= 3) tierLevel = 'Premium';
      else if (completedReferrals >= 1) tierLevel = 'Booster';

      return {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        positionBoost,
        tierLevel,
        rewards
      };
    } catch (error) {
      console.error('Referral stats service error:', error);
      return this.getDefaultStats();
    }
  }

  // Generate referral URL
  static generateReferralUrl(referralCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  }

  // Initialize referral code for user
  static async initializeReferralCode(userId: string): Promise<string> {
    try {
      // Check if user already has referral code
      const { data: user, error: userError } = await supabase
        .from('waitlist_users')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (user?.referral_code) {
        return user.referral_code;
      }

      // Generate new referral code
      const referralCode = this.generateReferralCode(userId);

      // Update user with referral code
      const { error: updateError } = await supabase
        .from('waitlist_users')
        .update({ referral_code: referralCode })
        .eq('id', userId);

      if (updateError) {
        console.error('Referral code creation error:', updateError);
        return '';
      }

      return referralCode;
    } catch (error) {
      console.error('Initialize referral code error:', error);
      return '';
    }
  }

  private static getDefaultStats(): ReferralStats {
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      positionBoost: 0,
      tierLevel: 'Starter',
      rewards: [
        { threshold: 1, reward: 'Move up 10 positions', achieved: false },
        { threshold: 3, reward: 'Premium member group', achieved: false },
        { threshold: 5, reward: 'Beta testing access', achieved: false },
        { threshold: 10, reward: 'Advisory board seat', achieved: false }
      ]
    };
  }
}

export default ReferralService;