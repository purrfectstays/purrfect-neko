import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GeolocationService, LocationData } from './geolocationService';

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

export interface QuizResponse {
  question_id: string;
  answer: string | number;
}

// Enhanced error handling helper with CORS detection
const handleServiceError = (error: any, operation: string): Error => {
  console.error(`WaitlistService.${operation} error:`, error);
  
  if (!isSupabaseConfigured) {
    return new Error('Service unavailable: Database configuration is invalid. Please check your environment variables.');
  }
  
  // Enhanced CORS error detection
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error('🚨 CORS Error Detected in WaitlistService!');
    console.error('Please configure CORS in your Supabase project:');
    console.error('1. Go to: https://supabase.com/dashboard/project/wllsdbhjhzquiyfklhei/settings/api');
    console.error('2. Add http://localhost:5173 to CORS origins');
    console.error('3. Add https://purrfectstays.org to CORS origins');
    
    return new Error('CORS Error: Please configure allowed origins in your Supabase project settings. Check the console for detailed instructions.');
  }
  
  if (error?.message?.includes('CORS') || error?.message?.includes('cross-origin')) {
    return new Error('CORS configuration required. Please add your domain to Supabase CORS settings.');
  }
  
  if (error?.message) {
    return new Error(`${operation} failed: ${error.message}`);
  }
  
  return new Error(`${operation} failed: An unexpected error occurred`);
};

// Enhanced network connectivity test with CORS detection
const testNetworkConnectivity = async (): Promise<{ connected: boolean; corsError: boolean }> => {
  if (!isSupabaseConfigured) {
    return { connected: false, corsError: false };
  }

  try {
    // Simple connectivity test with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return { connected: response.ok, corsError: false };
  } catch (error: any) {
    console.warn('Network connectivity test failed:', error);
    
    // Detect CORS errors
    const isCorsError = error.name === 'TypeError' && 
                       (error.message.includes('Failed to fetch') || 
                        error.message.includes('CORS') ||
                        error.message.includes('cross-origin'));
    
    return { connected: false, corsError: isCorsError };
  }
};

export class WaitlistService {
  static async registerUser(userData: {
    name: string;
    email: string;
    userType: 'cat-parent' | 'cattery-owner';
  }): Promise<{ user: WaitlistUser; verificationToken: string }> {
    if (!isSupabaseConfigured) {
      throw new Error('Service unavailable: Database configuration is invalid');
    }

    // Test connectivity before attempting registration
    const { connected, corsError } = await testNetworkConnectivity();
    if (!connected) {
      if (corsError) {
        throw new Error('CORS configuration required. Please add your domain to Supabase CORS settings in the dashboard.');
      }
      throw new Error('Unable to connect to the service. Please check your internet connection and try again.');
    }

    try {
      // Generate verification token
      const verificationToken = crypto.randomUUID();

      // Get user location for regional tracking
      let locationData: LocationData | null = null;
      try {
        locationData = await GeolocationService.getUserLocation();
      } catch (error) {
        console.warn('Failed to get user location:', error);
        // Continue with registration even if geolocation fails
      }

      // Insert user into database with basic fields first
      const { data, error } = await supabase
        .from('waitlist_users')
        .insert({
          name: userData.name,
          email: userData.email,
          user_type: userData.userType,
          verification_token: verificationToken,
          // Skip location data for now to avoid schema errors
          // TODO: Add location data after database migration is applied
        })
        .select()
        .single();

      if (error) {
        throw handleServiceError(error, 'Registration');
      }

      // Send verification email
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: userData.email,
            name: userData.name,
            verificationToken,
            userType: userData.userType,
          },
        });

        if (emailError) {
          console.error('Failed to send verification email:', emailError);
          
          // Provide more detailed error information
          let errorMessage = 'Failed to send verification email. ';
          
          if (emailError.message) {
            errorMessage += emailError.message;
          } else {
            errorMessage += 'Please check your configuration and try again.';
          }
          
          // Log additional details for debugging
          console.error('Email error details:', {
            error: emailError,
            userData: { email: userData.email, name: userData.name },
            verificationToken
          });
          
          throw new Error(errorMessage);
        }

        // Log successful email response for debugging
        if (emailData) {
          console.log('Verification email sent successfully:', emailData);
        }
      } catch (emailError) {
        // If email sending fails due to network issues, still return the user
        console.warn('Email sending failed, but user was registered:', emailError);
      }

      return { user: data, verificationToken };
    } catch (error) {
      throw handleServiceError(error, 'registerUser');
    }
  }

  static async verifyEmail(token: string): Promise<WaitlistUser> {
    if (!isSupabaseConfigured) {
      throw new Error('Service unavailable: Database configuration is invalid');
    }

    try {
      console.log('🔍 Searching for user with verification token:', token);
      console.log('🔍 Token received in service - length:', token.length);
      console.log('🔍 Token received in service - value:', JSON.stringify(token));
      
      // Let's also check what tokens exist in the database
      const { data: allTokens, error: allTokensError } = await supabase
        .from('waitlist_users')
        .select('verification_token, email, name')
        .not('verification_token', 'is', null);
      
      console.log('🔍 All tokens in database:', allTokens);
      
      // First, let's check if there are any users with this token
      const { data: searchData, error: searchError } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('verification_token', token);
      
      console.log('🔍 Search results:', searchData);
      console.log('🔍 Search error:', searchError);
      
      if (!searchData || searchData.length === 0) {
        console.error('❌ No user found with verification token:', token);
        throw new Error('Invalid or expired verification token');
      }
      
      const user = searchData[0];
      console.log('✅ Found user:', user);
      
      // Now update the user to mark as verified using the user ID (more reliable)
      const { data, error } = await supabase
        .from('waitlist_users')
        .update({
          is_verified: true,
          verification_token: null,
        })
        .eq('id', user.id)
        .select()
        .single();

      console.log('📝 Update result:', data);
      console.log('📝 Update error:', error);

      if (error) {
        console.error('❌ Failed to update user verification status:', error);
        throw new Error('Failed to update verification status');
      }

      if (!data) {
        console.error('❌ No data returned from update');
        throw new Error('Verification update failed');
      }

      console.log('✅ User verification completed successfully');
      return data;
    } catch (error) {
      console.error('❌ verifyEmail error:', error);
      throw handleServiceError(error, 'verifyEmail');
    }
  }

  static async submitQuizResponses(
    userId: string,
    responses: QuizResponse[]
  ): Promise<{ user: WaitlistUser; waitlistPosition: number }> {
    if (!isSupabaseConfigured) {
      throw new Error('Service unavailable: Database configuration is invalid');
    }

    try {
      // Insert quiz responses
      const { error: quizError } = await supabase
        .from('quiz_responses')
        .insert(
          responses.map(response => ({
            user_id: userId,
            question_id: response.question_id,
            answer: response.answer.toString(),
          }))
        );

      if (quizError) {
        throw handleServiceError(quizError, 'Quiz submission');
      }

      // Mark quiz as completed (this will trigger waitlist position assignment)
      const { data, error } = await supabase
        .from('waitlist_users')
        .update({ quiz_completed: true })
        .eq('id', userId)
        .select()
        .single();

      if (error || !data) {
        throw handleServiceError(error || new Error('No data returned'), 'Quiz completion');
      }

      // Send welcome email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: data.email,
            name: data.name,
            waitlistPosition: data.waitlist_position,
            userType: data.user_type,
          },
        });

        if (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      } catch (emailError) {
        console.warn('Welcome email sending failed:', emailError);
      }

      return { user: data, waitlistPosition: data.waitlist_position || 0 };
    } catch (error) {
      throw handleServiceError(error, 'submitQuizResponses');
    }
  }

  static async getWaitlistStats(signal?: AbortSignal): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    completedQuizzes: number;
  }> {
    // Return fallback stats if Supabase is not configured
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, returning fallback stats');
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }

    // Check if the signal is already aborted before making the request
    if (signal?.aborted) {
      console.warn('Request aborted before starting, returning fallback stats');
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }

    try {
      // Use the Supabase client with proper abort signal handling
      const { data, error } = await supabase
        .from('waitlist_users')
        .select('is_verified, quiz_completed')
        .abortSignal(signal);

      if (error) {
        throw error;
      }

      const totalUsers = data.length;
      const verifiedUsers = data.filter(user => user.is_verified).length;
      const completedQuizzes = data.filter(user => user.quiz_completed).length;

      return { totalUsers, verifiedUsers, completedQuizzes };
    } catch (error: any) {
      // Check if this is an AbortError (intentional cancellation)
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        console.warn('Request was cancelled (timeout or component unmount), returning fallback stats');
        return {
          totalUsers: 0,
          verifiedUsers: 0,
          completedQuizzes: 0
        };
      }

      // Enhanced CORS error detection and logging
      if (error?.name === 'TypeError' && error?.message?.includes('Failed to fetch')) {
        console.error('🚨 CORS Error in getWaitlistStats!');
        console.error('To fix this issue:');
        console.error('1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/wllsdbhjhzquiyfklhei/settings/api');
        console.error('2. Scroll to the CORS section');
        console.error('3. Add these origins:');
        console.error('   - http://localhost:5173');
        console.error('   - https://purrfectstays.org');
        console.error('4. Save the changes');
        console.error('5. Refresh this page');
      }

      // Enhanced error logging for debugging other errors
      console.warn('Failed to fetch waitlist stats:', {
        error: error,
        errorMessage: error?.message,
        errorName: error?.name,
        isSupabaseConfigured,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'configured' : 'missing',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      });

      // Return fallback stats when network fails
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        completedQuizzes: 0
      };
    }
  }

  static async getUserByEmail(email: string): Promise<WaitlistUser | null> {
    if (!isSupabaseConfigured) {
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
}