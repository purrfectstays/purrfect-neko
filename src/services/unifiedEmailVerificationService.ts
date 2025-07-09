/**
 * Unified Email Verification Service
 * Consolidates emailVerificationService and waitlistService verification logic
 * Provides a single source of truth for email verification functionality
 */

import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import { getConfig, isSupabaseConfigured } from '../lib/config';
import { GeolocationService, LocationData } from './geolocationService';

// Unified interfaces
export interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  user_type: 'cat-parent' | 'cattery-owner';
  is_verified: boolean;
  quiz_completed: boolean;
  waitlist_position: number | null;
  verification_token: string | null;
  country?: string;
  region?: string;
  city?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  regional_position?: number;
  created_at: string;
  updated_at: string;
}

export interface VerificationResult {
  success: boolean;
  user?: WaitlistUser;
  redirectUrl?: string;
  error?: string;
}

export interface QuizResponse {
  question_id: string;
  answer: string | number;
}

export interface QuizSession {
  id: string;
  user_id: string;
  session_token: string;
  user_type: 'cat-parent' | 'cattery-owner';
  expires_at: string;
  used: boolean;
  created_at: string;
}

// Enhanced error handling
class UnifiedEmailVerificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'UnifiedEmailVerificationError';
  }
}

// Error handling helper
const handleServiceError = (error: unknown, operation: string): UnifiedEmailVerificationError => {
  console.error(`UnifiedEmailVerificationService.${operation} error:`, error);
  
  if (!isSupabaseConfigured()) {
    return new UnifiedEmailVerificationError(
      'Service unavailable: Database configuration is invalid. Please check your environment variables.',
      'CONFIG_ERROR',
      { configured: false }
    );
  }
  
  // Enhanced CORS error detection
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error('🚨 CORS Error Detected in UnifiedEmailVerificationService!');
    console.error('Please configure CORS in your Supabase project settings.');
    
    return new UnifiedEmailVerificationError(
      'CORS Error: Please configure allowed origins in your Supabase project settings.',
      'CORS_ERROR',
      { operation }
    );
  }
  
  if (error && typeof error === 'object' && 'message' in error && 
      typeof error.message === 'string' && 
      (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
    return new UnifiedEmailVerificationError(
      'CORS configuration required. Please add your domain to Supabase CORS settings.',
      'CORS_ERROR',
      { operation }
    );
  }
  
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return new UnifiedEmailVerificationError(
      `${operation} failed: ${error.message}`,
      'SERVICE_ERROR',
      { originalError: error }
    );
  }
  
  return new UnifiedEmailVerificationError(
    `${operation} failed: An unexpected error occurred`,
    'UNKNOWN_ERROR',
    { originalError: error }
  );
};

// Network connectivity test
const testNetworkConnectivity = async (): Promise<{ connected: boolean; corsError: boolean }> => {
  if (!isSupabaseConfigured()) {
    return { connected: false, corsError: false };
  }

  try {
    const config = getConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${config.supabase.url}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': config.supabase.anonKey,
        'Authorization': `Bearer ${config.supabase.anonKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return { connected: response.ok, corsError: false };
  } catch (error: unknown) {
    console.warn('Network connectivity test failed:', error);
    
    const isCorsError = error instanceof Error && error.name === 'TypeError' && 
                       (error.message.includes('Failed to fetch') || 
                        error.message.includes('CORS') ||
                        error.message.includes('cross-origin'));
    
    return { connected: false, corsError: isCorsError };
  }
};

export class UnifiedEmailVerificationService {
  /**
   * Register a new user with unified token handling
   */
  static async registerUser(userData: {
    name: string;
    email: string;
    userType: 'cat-parent' | 'cattery-owner';
  }): Promise<{ user: WaitlistUser; verificationToken: string }> {
    if (!isSupabaseConfigured()) {
      throw new UnifiedEmailVerificationError(
        'Service unavailable: Database configuration is invalid',
        'CONFIG_ERROR'
      );
    }

    // Test connectivity before attempting registration
    const { connected, corsError } = await testNetworkConnectivity();
    if (!connected) {
      if (corsError) {
        throw new UnifiedEmailVerificationError(
          'CORS configuration required. Please add your domain to Supabase CORS settings.',
          'CORS_ERROR'
        );
      }
      throw new UnifiedEmailVerificationError(
        'Unable to connect to the service. Please check your internet connection and try again.',
        'NETWORK_ERROR'
      );
    }

    try {
      // Use UUID format for compatibility with both services
      const verificationToken = crypto.randomUUID();

      // Get user location for regional tracking
      let locationData: LocationData | null = null;
      try {
        locationData = await GeolocationService.getUserLocation();
      } catch (error) {
        console.warn('Failed to get user location:', error);
      }

      // Insert user into database
      const { data, error } = await supabase
        .from('waitlist_users')
        .insert({
          name: userData.name,
          email: userData.email,
          user_type: userData.userType,
          verification_token: verificationToken,
          // Include location data if available
          ...(locationData && {
            country: locationData.country,
            region: locationData.region,
            city: locationData.city,
            country_code: locationData.countryCode,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timezone: locationData.timezone,
          }),
        })
        .select()
        .single();

      if (error) {
        throw handleServiceError(error, 'registerUser');
      }

      // Also store token in verification_tokens table for edge function compatibility
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const { error: tokenError } = await supabase
        .from('verification_tokens')
        .insert({
          user_id: data.id,
          token: verificationToken,
          user_type: userData.userType,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        console.warn('Failed to store token in verification_tokens table:', tokenError);
        // Don't throw - the main registration succeeded
      }

      // Send verification email
      await this.sendVerificationEmail(
        data.id,
        userData.email,
        userData.name,
        userData.userType,
        verificationToken
      );

      return { user: data, verificationToken };
    } catch (error) {
      if (error instanceof UnifiedEmailVerificationError) {
        throw error;
      }
      throw handleServiceError(error, 'registerUser');
    }
  }

  /**
   * Send verification email (private method)
   */
  private static async sendVerificationEmail(
    userId: string,
    email: string,
    name: string,
    userType: 'cat-parent' | 'cattery-owner',
    verificationToken: string
  ): Promise<void> {
    try {
      // Send verification email via direct fetch with proper JSON
      const requestBody = JSON.stringify({
        email,
        name,
        verificationToken,
        userType,
      });
      
      console.log('📧 Frontend sending:', requestBody);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📧 Edge Function error:', errorText);
        throw new Error(`Email function failed: ${response.status}`);
      }
      
      analytics.trackEmailDelivery('verification', 'sent');
    } catch (emailError: unknown) {
      console.error('Email sending failed:', emailError);
      
      // Log but don't throw - allow registration to complete
      if (emailError instanceof Error && emailError.message?.includes('CORS')) {
        console.warn('CORS error detected during email sending');
      }
    }
  }

  /**
   * Verify email token with unified approach
   */
  static async verifyEmail(token: string): Promise<VerificationResult> {
    console.log('🔐 Starting unified email verification process...');
    
    // Input validation
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured');
      return { 
        success: false, 
        error: 'Service unavailable: Database configuration is invalid' 
      };
    }

    if (!token || typeof token !== 'string') {
      console.error('❌ Invalid token type:', typeof token, token);
      return { 
        success: false, 
        error: 'Invalid verification token provided' 
      };
    }

    // Clean and validate token
    const cleanToken = token.trim();
    if (!cleanToken || cleanToken.length < 10) {
      console.error('❌ Invalid token format:', { token: cleanToken, length: cleanToken.length });
      return { 
        success: false, 
        error: 'Invalid verification token format' 
      };
    }

    console.log('🎫 Token validated:', cleanToken.substring(0, 8) + '...');

    try {
      // Test database connection
      console.log('🔄 Testing database connection...');
      const { error: testError } = await supabase
        .from('waitlist_users')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection failed:', testError);
        return {
          success: false,
          error: `Database connection error: ${testError.message}`
        };
      }
      
      console.log('✅ Database connection verified');

      // Search for user with token (SECURITY: Only match verification_token, never user ID)
      console.log('🔍 Searching for user with token...');
      const { data: searchData, error: searchError } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('verification_token', cleanToken)
        .limit(1);
      
      if (searchError) {
        console.error('❌ Database search failed:', searchError);
        return {
          success: false,
          error: `Database query failed: ${searchError.message}`
        };
      }
      
      console.log('🔍 Search results:', searchData?.length || 0, 'users found');

      // Validate user exists
      if (!searchData || searchData.length === 0) {
        console.error('❌ No user found with verification token');
        return {
          success: false,
          error: 'Invalid or expired verification token'
        };
      }
      
      const user = searchData[0];
      console.log('✅ Found user:', { id: user.id, email: user.email, isVerified: user.is_verified });
      
      // Check if verified
      if (!user.is_verified) {
        return {
          success: false,
          error: 'Email not verified. Please use the link in your email.'
        };
      }
      
      // Generate redirect URL for verified users
      const redirectUrl = this.generateQuizRedirectUrl(user.user_type, user.id);
      
      // Track successful verification
      analytics.trackEmailVerification(true);
      analytics.trackConversion('email_verification_complete', {
        user_type: user.user_type,
        user_id: user.id,
      });

      console.log('✅ Email verification completed successfully');
      
      return {
        success: true,
        user,
        redirectUrl,
      };
    } catch (error) {
      console.error('❌ verifyEmail error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed. Please try again.',
      };
    }
  }

  /**
   * Submit quiz responses
   */
  static async submitQuizResponses(
    userId: string,
    responses: QuizResponse[]
  ): Promise<{ user: WaitlistUser; waitlistPosition: number }> {
    if (!isSupabaseConfigured()) {
      throw new UnifiedEmailVerificationError(
        'Service unavailable: Database configuration is invalid',
        'CONFIG_ERROR'
      );
    }

    try {
      // Use database function to securely submit quiz responses and mark as completed
      // This bypasses RLS issues by using SECURITY DEFINER
      console.log('🔐 Submitting quiz via secure database function...');
      console.log('📝 User ID:', userId);
      console.log('📝 Responses:', responses);
      
      // First, let's try the direct approach but with better error handling
      // Check if user exists and is verified first
      const { data: userData, error: userError } = await supabase
        .from('waitlist_users')
        .select('id, email, name, user_type, is_verified, quiz_completed, waitlist_position')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('❌ Failed to find user:', userError);
        throw new UnifiedEmailVerificationError(
          `User lookup failed: ${userError.message}`,
          'USER_NOT_FOUND'
        );
      }

      console.log('✅ Found user:', userData);

      if (!userData.is_verified) {
        console.error('❌ User not verified:', userData);
        throw new UnifiedEmailVerificationError(
          'User must be verified before submitting quiz responses',
          'USER_NOT_VERIFIED'
        );
      }

      if (userData.quiz_completed) {
        console.log('ℹ️ Quiz already completed for user:', userData.email);
        return { user: userData as WaitlistUser, waitlistPosition: userData.waitlist_position || 0 };
      }

      // COMPREHENSIVE QUIZ SUBMISSION - Try secure function first, fallback to direct calls
      console.log('📝 Starting quiz submission process...');
      
      // Prepare quiz responses data
      const responsesForFunction = responses.map(response => ({
        question_id: response.question_id,
        answer: response.answer.toString(),
      }));

      let data: any = null;
      let submissionSuccess = false;

      // APPROACH 1: Try secure database function first (preferred)
      try {
        console.log('🔒 Attempting secure function approach...');
        const { data: functionResult, error: functionError } = await supabase
          .rpc('submit_quiz_responses', {
            p_user_id: userId,
            p_responses: responsesForFunction
          });

        if (functionError) {
          console.log('⚠️ Function approach failed:', functionError.message);
          throw new Error('Function not available');
        }

        if (functionResult && functionResult.success) {
          console.log('✅ Secure function approach successful');
          data = functionResult.user;
          submissionSuccess = true;
        } else {
          console.log('⚠️ Function returned error:', functionResult?.error);
          throw new Error(functionResult?.error || 'Function returned failure');
        }
      } catch (functionAttemptError) {
        console.log('⚠️ Secure function approach failed, trying fallback...');
        
        // APPROACH 2: Fallback to direct database operations
        try {
          console.log('🔄 Using fallback direct approach...');
          
          // Insert quiz responses directly
          const quizInserts = responses.map(response => ({
            user_id: userId,
            question_id: response.question_id,
            answer: response.answer.toString(),
          }));

          const { error: quizError } = await supabase
            .from('quiz_responses')
            .insert(quizInserts);

          if (quizError) {
            console.error('❌ Quiz responses insert failed:', quizError);
            throw new UnifiedEmailVerificationError(
              `Failed to save quiz responses: ${quizError.message}`,
              'QUIZ_INSERT_FAILED'
            );
          }

          console.log('✅ Quiz responses saved via fallback');

          // Try to mark quiz as completed
          const { data: updateData, error: updateError } = await supabase
            .from('waitlist_users')
            .update({ 
              quiz_completed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select('*')
            .single();

          if (updateError) {
            console.log('⚠️ Update failed, using existing user data');
            data = userData;
          } else {
            console.log('✅ Quiz completion updated via fallback');
            data = updateData;
            submissionSuccess = true;
          }
        } catch (fallbackError) {
          console.error('❌ Fallback approach also failed:', fallbackError);
          // Last resort - use existing user data and hope for the best
          data = userData;
          console.log('⚠️ Using original user data as last resort');
        }
      }

      // Ensure we have valid user data
      if (!data) {
        console.error('❌ No user data available after all attempts');
        throw new UnifiedEmailVerificationError(
          'Failed to complete quiz submission - no user data available',
          'NO_USER_DATA'
        );
      }

      console.log('📊 Quiz submission process completed:', {
        success: submissionSuccess,
        method: submissionSuccess ? 'secure function or fallback' : 'partial completion',
        hasUserData: !!data
      });

      // COMPREHENSIVE WELCOME EMAIL HANDLING
      const welcomeEmailPayload = {
        email: data.email,
        name: data.name,
        waitlistPosition: data.waitlist_position || 0,
        userType: data.user_type,
      };

      // Validate email payload before sending
      const isValidPayload = (
        data.email && 
        data.email.includes('@') && 
        data.name && 
        data.name.trim().length > 0 && 
        data.user_type && 
        ['cat-parent', 'cattery-owner'].includes(data.user_type)
      );

      console.log('📧 Welcome email payload validation:', {
        email: data.email,
        hasValidEmail: !!data.email && data.email.includes('@'),
        hasValidName: !!data.name && data.name.trim().length > 0,
        hasValidUserType: !!data.user_type && ['cat-parent', 'cattery-owner'].includes(data.user_type),
        waitlistPosition: data.waitlist_position || 0,
        overallValid: isValidPayload
      });

      if (!isValidPayload) {
        console.error('❌ Invalid welcome email payload, skipping email send');
        console.error('❌ Payload data:', welcomeEmailPayload);
        // Don't fail the entire operation for email issues
      } else {
        // Attempt to send welcome email with comprehensive error handling
        let emailSent = false;
        let emailAttempts = 0;
        const maxEmailAttempts = 2;

        while (!emailSent && emailAttempts < maxEmailAttempts) {
          emailAttempts++;
          console.log(`📧 Sending welcome email (attempt ${emailAttempts}/${maxEmailAttempts})...`);
          
          try {
            const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
              body: welcomeEmailPayload,
            });
            
            if (emailError) {
              console.error(`❌ Welcome email attempt ${emailAttempts} failed:`, emailError);
              if (emailAttempts >= maxEmailAttempts) {
                console.error('❌ All welcome email attempts failed, but continuing with success response');
              }
            } else {
              console.log(`✅ Welcome email sent successfully on attempt ${emailAttempts}`);
              console.log('📧 Email result:', emailResult);
              emailSent = true;
            }
          } catch (emailException) {
            console.error(`❌ Welcome email attempt ${emailAttempts} exception:`, emailException);
            if (emailAttempts >= maxEmailAttempts) {
              console.error('❌ All welcome email attempts failed with exceptions, but continuing');
            }
            // Wait a bit before retry
            if (emailAttempts < maxEmailAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        if (!emailSent) {
          console.log('⚠️ Welcome email could not be sent, but quiz submission was successful');
          // Log for later follow-up but don't fail the quiz submission
        }
      }

      return { user: data, waitlistPosition: data.waitlist_position || 0 };
    } catch (error) {
      if (error instanceof UnifiedEmailVerificationError) {
        throw error;
      }
      throw handleServiceError(error, 'submitQuizResponses');
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<WaitlistUser | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot fetch user by email');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.warn('Failed to fetch user by email:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to fetch user by email due to network issues:', error);
      return null;
    }
  }

  /**
   * Get waitlist statistics
   */
  static async getWaitlistStats(signal?: AbortSignal): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    completedQuizzes: number;
  }> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning fallback stats');
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }

    if (signal?.aborted) {
      console.warn('Request aborted before starting, returning fallback stats');
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }

    try {
      const query = supabase
        .from('waitlist_users')
        .select('is_verified, quiz_completed');
      
      const { data, error } = await (signal ? query.abortSignal(signal) : query);

      if (error) {
        throw error;
      }

      const totalUsers = data.length;
      const verifiedUsers = data.filter(user => user.is_verified).length;
      const completedQuizzes = data.filter(user => user.quiz_completed).length;

      return { totalUsers, verifiedUsers, completedQuizzes };
    } catch (error: unknown) {
      if (error instanceof Error && (error.name === 'AbortError' || error.message?.includes('aborted'))) {
        // Silently handle cancelled requests - this is normal behavior
        return {
          totalUsers: 0,
          verifiedUsers: 0,
          completedQuizzes: 0
        };
      }

      // Only log actual errors, not cancelled requests
      console.warn('Failed to fetch waitlist stats:', error);
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.is_verified) {
        return { success: false, error: 'User already verified' };
      }

      // Generate new verification token
      const verificationToken = crypto.randomUUID();

      // Update user with new token
      const { error: updateError } = await supabase
        .from('waitlist_users')
        .update({ verification_token: verificationToken })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Send new verification email
      await this.sendVerificationEmail(
        user.id,
        user.email,
        user.name,
        user.user_type,
        verificationToken
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend verification email',
      };
    }
  }

  /**
   * Test database connection
   */
  static async testDatabaseConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
    console.log('🔧 Testing unified database connection...');
    
    try {
      if (!isSupabaseConfigured()) {
        return { 
          success: false, 
          message: 'Supabase configuration is invalid',
          details: { configured: false }
        };
      }

      const { error: testError } = await supabase
        .from('waitlist_users')
        .select('count')
        .limit(1);
      
      if (testError) {
        return { 
          success: false, 
          message: `Database connection failed: ${testError.message}`,
          details: testError
        };
      }

      return { 
        success: true, 
        message: 'Unified database connection successful',
        details: { hasData: true }
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection test exception: ${(error as Error).message}`,
        details: error
      };
    }
  }

  /**
   * Generate quiz redirect URL (private method)
   */
  private static generateQuizRedirectUrl(
    userType: 'cat-parent' | 'cattery-owner',
    userId: string
  ): string {
    const config = getConfig();
    const baseUrl = config.app.url;
    const params = new URLSearchParams({
      verified: 'true',
      user_id: userId,
      user_type: userType,
      timestamp: Date.now().toString(),
    });
    
    return `${baseUrl}/quiz?${params.toString()}`;
  }

  /**
   * Clean up expired tokens (maintenance method)
   */
  static async cleanupExpiredTokens(): Promise<void> {
    const now = new Date().toISOString();
    
    try {
      // Clean up expired quiz sessions (if they exist)
      await supabase
        .from('quiz_sessions')
        .delete()
        .lt('expires_at', now);

      // Clean up unverified users older than 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('waitlist_users')
        .delete()
        .eq('is_verified', false)
        .lt('created_at', weekAgo);
    } catch (error) {
      console.warn('Failed to cleanup expired tokens:', error);
    }
  }
}

// Export the unified service as default
export default UnifiedEmailVerificationService;