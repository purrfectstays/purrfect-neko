import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  user_type: 'cat-parent' | 'cattery-owner';
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface VerificationResult {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    user_type: 'cat-parent' | 'cattery-owner';
    is_verified: boolean;
  };
  redirectUrl?: string;
  error?: string;
}

export class EmailVerificationService {
  /**
   * Generate a secure verification token and send verification email
   */
  static async sendVerificationEmail(
    userId: string,
    email: string,
    name: string,
    userType: 'cat-parent' | 'cattery-owner'
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // Generate cryptographically secure token
      const token = this.generateSecureToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token in database
      const { error: tokenError } = await supabase
        .from('verification_tokens')
        .insert({
          user_id: userId,
          token,
          user_type: userType,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        throw new Error(`Failed to create verification token: ${tokenError.message}`);
      }

      // Send verification email via edge function
      const { data, error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          name,
          verificationToken: token,
          userType,
        },
      });

      if (emailError) {
        // Clean up token if email fails
        await supabase
          .from('verification_tokens')
          .delete()
          .eq('token', token);
        
        throw new Error(`Failed to send verification email: ${emailError.message}`);
      }

      analytics.trackEmailDelivery('verification', 'sent');
      
      return { success: true, token };
    } catch (error) {
      analytics.trackError('verification_email_failed', error instanceof Error ? error.message : 'Unknown error');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send verification email' 
      };
    }
  }

  /**
   * Verify email token and return user data with redirect URL
   */
  static async verifyEmailToken(token: string): Promise<VerificationResult> {
    try {
      if (!token || typeof token !== 'string') {
        return { success: false, error: 'Invalid verification token' };
      }

      // Get verification token with user data
      const { data: tokenData, error: tokenError } = await supabase
        .from('verification_tokens')
        .select(`
          *,
          waitlist_users (
            id,
            name,
            email,
            user_type,
            is_verified
          )
        `)
        .eq('token', token)
        .eq('used', false)
        .single();

      if (tokenError || !tokenData) {
        analytics.trackError('verification_failed', 'Invalid or expired token');
        return { success: false, error: 'Invalid or expired verification link' };
      }

      // Check if token has expired
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);
      
      if (now > expiresAt) {
        // Clean up expired token
        await supabase
          .from('verification_tokens')
          .delete()
          .eq('token', token);
        
        analytics.trackError('verification_failed', 'Token expired');
        return { success: false, error: 'Verification link has expired. Please request a new one.' };
      }

      // Mark token as used (single-use security)
      const { error: updateTokenError } = await supabase
        .from('verification_tokens')
        .update({ used: true })
        .eq('token', token);

      if (updateTokenError) {
        throw new Error('Failed to update token status');
      }

      // Mark user as verified
      const { data: updatedUser, error: userUpdateError } = await supabase
        .from('waitlist_users')
        .update({ is_verified: true })
        .eq('id', tokenData.user_id)
        .select()
        .single();

      if (userUpdateError || !updatedUser) {
        throw new Error('Failed to verify user account');
      }

      // Generate secure redirect URL with session token
      const sessionToken = this.generateSecureToken();
      const redirectUrl = this.generateQuizRedirectUrl(
        updatedUser.user_type,
        updatedUser.id,
        sessionToken
      );

      // Store session token for quiz access validation
      await this.createQuizSession(updatedUser.id, sessionToken, updatedUser.user_type);

      analytics.trackEmailVerification(true);
      analytics.trackConversion('email_verification_complete', {
        user_type: updatedUser.user_type,
        user_id: updatedUser.id,
      });

      return {
        success: true,
        user: updatedUser,
        redirectUrl,
      };
    } catch (error) {
      analytics.trackError('verification_process_failed', error instanceof Error ? error.message : 'Unknown error');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed. Please try again.',
      };
    }
  }

  /**
   * Validate quiz access with session token
   */
  static async validateQuizAccess(
    userId: string,
    sessionToken: string,
    userType: 'cat-parent' | 'cattery-owner'
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check if session token is valid and not expired
      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_token', sessionToken)
        .eq('user_type', userType)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (sessionError || !sessionData) {
        return { valid: false, error: 'Invalid or expired quiz access. Please verify your email again.' };
      }

      // Verify user is actually verified
      const { data: userData, error: userError } = await supabase
        .from('waitlist_users')
        .select('is_verified, user_type')
        .eq('id', userId)
        .single();

      if (userError || !userData || !userData.is_verified || userData.user_type !== userType) {
        return { valid: false, error: 'User verification required. Please check your email.' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: 'Access validation failed. Please verify your email again.' 
      };
    }
  }

  /**
   * Mark quiz session as used after quiz completion
   */
  static async markQuizSessionUsed(userId: string, sessionToken: string): Promise<void> {
    await supabase
      .from('quiz_sessions')
      .update({ used: true })
      .eq('user_id', userId)
      .eq('session_token', sessionToken);
  }

  /**
   * Clean up expired tokens and sessions
   */
  static async cleanupExpiredTokens(): Promise<void> {
    const now = new Date().toISOString();
    
    // Clean up expired verification tokens
    await supabase
      .from('verification_tokens')
      .delete()
      .lt('expires_at', now);

    // Clean up expired quiz sessions
    await supabase
      .from('quiz_sessions')
      .delete()
      .lt('expires_at', now);
  }

  /**
   * Generate cryptographically secure token
   */
  private static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate quiz redirect URL with session token
   */
  private static generateQuizRedirectUrl(
    userType: 'cat-parent' | 'cattery-owner',
    userId: string,
    sessionToken: string
  ): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      verified: 'true',
      user_id: userId,
      user_type: userType,
      session_token: sessionToken,
      timestamp: Date.now().toString(),
    });
    
    return `${baseUrl}/quiz?${params.toString()}`;
  }

  /**
   * Create quiz session for access validation
   */
  private static async createQuizSession(
    userId: string,
    sessionToken: string,
    userType: 'cat-parent' | 'cattery-owner'
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        user_type: userType,
        expires_at: expiresAt.toISOString(),
      });
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('email', email)
        .eq('is_verified', false)
        .single();

      if (userError || !userData) {
        return { success: false, error: 'User not found or already verified' };
      }

      // Clean up any existing tokens for this user
      await supabase
        .from('verification_tokens')
        .delete()
        .eq('user_id', userData.id);

      // Send new verification email
      return await this.sendVerificationEmail(
        userData.id,
        userData.email,
        userData.name,
        userData.user_type
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend verification email',
      };
    }
  }
}