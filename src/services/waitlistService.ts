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
    console.error('1. Go to your Supabase Dashboard settings/api page');
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
      // Generate verification token (secure random string)
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
          
          // Check for CORS error
          if (emailError.message && emailError.message.includes('CORS')) {
            throw new Error('Email service configuration error. Please contact support at support@purrfectstays.org');
          }
          
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
          
          // Don't throw error - user is registered but email failed
          console.warn('User registered but email failed to send. User can request resend.');
        }

        // Log successful email response for debugging
        if (emailData) {
          console.log('Verification email sent successfully:', emailData);
        }
      } catch (emailError: any) {
        // If email sending fails due to network issues, still return the user
        console.error('Email sending failed, but user was registered:', emailError);
        
        // Check if it's a CORS error
        if (emailError.message && (emailError.message.includes('CORS') || emailError.message.includes('Failed to send a request'))) {
          console.error('CORS error detected. User registered but email could not be sent.');
          // Don't throw - allow registration to complete
        }
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
      console.log('🔍 Verifying email with token:', token);
      console.log('🔍 Token length:', token.length);
      
      // Clean and validate token
      const cleanToken = token.trim();
      if (!cleanToken) {
        throw new Error('Invalid verification token');
      }
      
      // Use the stored procedure first as it bypasses RLS issues
      console.log('🔄 Using stored procedure for verification...');
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('verify_email_with_token', { token_param: cleanToken });
        
      if (rpcError) {
        console.error('❌ Stored procedure failed:', rpcError);
        
        // Fallback to direct database query for debugging
        console.log('🔄 Falling back to direct database query...');
        
        // First, let's check if there are any users with this token
        const { data: searchData, error: searchError } = await supabase
          .from('waitlist_users')
          .select('id, email, name, user_type, is_verified, verification_token')
          .eq('verification_token', cleanToken);
        
        console.log('🔍 Search results:', searchData);
        console.log('🔍 Search error:', searchError);
        
        if (searchError) {
          throw new Error(`Database query failed: ${searchError.message}`);
        }
        
        if (!searchData || searchData.length === 0) {
          console.error('❌ No user found with verification token:', cleanToken);
          
          // Check if there are any tokens in the database at all
          const { data: allTokens } = await supabase
            .from('waitlist_users')
            .select('verification_token, email')
            .not('verification_token', 'is', null)
            .limit(5);
          
          console.log('🔍 Sample tokens in database:', allTokens?.map(t => ({ 
            token: t.verification_token, 
            email: t.email,
            length: t.verification_token?.length 
          })));
          
          throw new Error('No user found with verification token');
        }
        
        const user = searchData[0];
        console.log('✅ Found user:', user);
        
        if (user.is_verified) {
          throw new Error('Email already verified');
        }
        
        // Try direct update
        const { data: updateData, error: updateError } = await supabase
          .from('waitlist_users')
          .update({
            is_verified: true,
            verification_token: null,
          })
          .eq('verification_token', cleanToken)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Direct update failed:', updateError);
          throw new Error(`Failed to update verification status: ${updateError.message}`);
        }

        console.log('✅ Direct update successful');
        return updateData;
      }
      
      if (!rpcData?.success) {
        console.error('❌ Stored procedure returned failure:', rpcData);
        throw new Error(rpcData?.error || 'Failed to verify email');
      }
      
      console.log('✅ Verification successful via stored procedure');
      return rpcData.user;
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
        console.error('1. Open your Supabase Dashboard settings/api page');
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