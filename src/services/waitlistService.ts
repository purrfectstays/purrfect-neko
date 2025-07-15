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

// BULLETPROOF ABORT ERROR DETECTION
const isAbortError = (error: unknown): boolean => {
  if (!error) return false;
  
  // Convert to string for comprehensive checking
  const errorString = String(error).toLowerCase();
  const errorMessage = error instanceof Error ? (error.message || '').toLowerCase() : '';
  const errorName = error instanceof Error ? (error.name || '').toLowerCase() : '';
  
  // Check for AbortController.signal.aborted
  if (error instanceof Error && 'cause' in error && error.cause) {
    const causeString = String(error.cause).toLowerCase();
    if (causeString.includes('abort') || causeString.includes('signal')) {
      return true;
    }
  }
  
  // Ultra-comprehensive abort detection patterns
  const abortPatterns = [
    'aborterror',
    'aborted',
    'signal is aborted',
    'abort',
    'signal is aborted without reason',
    'operation was aborted',
    'the operation was aborted',
    'request aborted',
    'abortcontroller',
    'signal aborted'
  ];
  
  return abortPatterns.some(pattern => 
    errorName.includes(pattern) || 
    errorMessage.includes(pattern) || 
    errorString.includes(pattern)
  );
};

// BULLETPROOF API CALL WRAPPER
const safeApiCall = async <T>(apiCall: () => Promise<T>, fallbackValue: T, operation: string): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: unknown) {
    // Silently handle ALL abort-related errors
    if (isAbortError(error)) {
      return fallbackValue;
    }
    
    // Log and handle other errors normally
    console.warn(`${operation} failed:`, error);
    return fallbackValue;
  }
};

// Enhanced error handling helper with CORS detection
const handleServiceError = (error: any, operation: string): Error => {
  // SILENTLY HANDLE ALL ABORT ERRORS
  if (isAbortError(error)) {
    return new Error('Request was cancelled');
  }
  
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
    // SILENTLY HANDLE ABORT ERRORS
    if (isAbortError(error)) {
      return { connected: false, corsError: false };
    }
    
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
    // Clear any stale localStorage data to prevent user ID mix-ups
    localStorage.removeItem('purrfect_verified_user');
    localStorage.removeItem('purrfect_user_context');
    
    if (!isSupabaseConfigured) {
      throw new Error('Service unavailable: Database configuration is invalid');
    }

    // Skip network connectivity test for CAPTCHA registrations
    // const { connected, corsError } = await testNetworkConnectivity();
    // if (!connected) {
    //   if (corsError) {
    //     throw new Error('CORS configuration required. Please add your domain to Supabase CORS settings in the dashboard.');
    //   }
    //   throw new Error('Unable to connect to the service. Please check your internet connection and try again.');
    // }

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
          is_verified: true, // Auto-verify users after CAPTCHA verification
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
        console.log('🔧 Calling Edge Function: send-verification-email');
        console.log('🔧 Supabase URL from env:', import.meta.env.VITE_SUPABASE_URL);
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: {
            email: userData.email,
            name: userData.name,
            verificationToken,
            userType: userData.userType,
          },
          headers: {
            'Content-Type': 'application/json',
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
    console.log('🔐 Starting email verification process...');
    
    // 1. VALIDATE INPUTS
    if (!isSupabaseConfigured) {
      console.error('❌ Supabase not configured');
      throw new Error('Service unavailable: Database configuration is invalid');
    }

    if (!token || typeof token !== 'string') {
      console.error('❌ Invalid token type:', typeof token, token);
      throw new Error('Invalid verification token provided');
    }

    // 2. CLEAN AND VALIDATE TOKEN
    const cleanToken = token.trim();
    if (!cleanToken || cleanToken.length < 10) {
      console.error('❌ Invalid token format:', { token: cleanToken, length: cleanToken.length });
      throw new Error('Invalid verification token format');
    }

    console.log('🎫 Token validated:', cleanToken.substring(0, 8) + '...');
    console.log('📏 Token length:', cleanToken.length);

    try {
      // 3. TEST DATABASE CONNECTION FIRST
      console.log('🔄 Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('waitlist_users')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection failed:', testError);
        throw new Error(`Database connection error: ${testError.message}`);
      }
      
      console.log('✅ Database connection verified');

      // 4. SEARCH FOR USER WITH TOKEN
      console.log('🔍 Searching for user with token...');
      const { data: searchData, error: searchError } = await supabase
        .from('waitlist_users')
        .select('id, email, name, user_type, is_verified, verification_token')
        .eq('verification_token', cleanToken)
        .limit(1);
      
      if (searchError) {
        console.error('❌ Database search failed:', searchError);
        throw new Error(`Database query failed: ${searchError.message}`);
      }
      
      console.log('🔍 Search results:', searchData?.length || 0, 'users found');

      // 5. VALIDATE USER EXISTS
      if (!searchData || searchData.length === 0) {
        console.error('❌ No user found with verification token');
        
        // Debug: Show sample tokens in database
        try {
          const { data: allTokens } = await supabase
            .from('waitlist_users')
            .select('verification_token, email, created_at')
            .not('verification_token', 'is', null)
            .order('created_at', { ascending: false })
            .limit(3);
          
          console.log('🔍 Sample recent tokens in database:', allTokens?.map(t => ({ 
            tokenPreview: t.verification_token?.substring(0, 8) + '...',
            email: t.email,
            created: t.created_at,
            length: t.verification_token?.length 
          })));
        } catch (debugError) {
          console.error('❌ Debug query failed:', debugError);
        }
        
        throw new Error('Invalid or expired verification token');
      }
      
      const user = searchData[0];
      console.log('✅ Found user:', { id: user.id, email: user.email, isVerified: user.is_verified });
      
      // 6. CHECK IF ALREADY VERIFIED
      if (user.is_verified) {
        console.log('ℹ️ User already verified');
        return user; // Return user data, don't throw error
      }

      // 7. VALIDATE EMAIL FORMAT
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        console.error('❌ Invalid email format:', user.email);
        throw new Error('Invalid email format in user record');
      }

      // REMOVED: Client-side verification update (causes RLS 406 errors)
      // Verification must be handled server-side by the Edge Function only
      console.error('❌ Client-side email verification is not allowed due to RLS restrictions.');
      console.log('ℹ️ Please use the verification link sent to your email instead.');
      
      throw new Error('Email verification must be completed using the link sent to your email. Client-side verification is not permitted for security reasons.');
      
    } catch (error) {
      console.error('❌ verifyEmail error:', error);
      console.error('❌ Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack?.split('\n').slice(0, 3).join('\n')
      });
      throw handleServiceError(error, 'verifyEmail');
    }
  }

  // Database connection test function
  static async testDatabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    console.log('🔧 Testing database connection...');
    
    return await safeApiCall(
      async () => {
        if (!isSupabaseConfigured) {
          return { 
            success: false, 
            message: 'Supabase configuration is invalid',
            details: { configured: false }
          };
        }

        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('waitlist_users')
          .select('count')
          .limit(1);
        
        if (testError) {
          // Check for abort error
          if (isAbortError(testError)) {
            return { 
              success: false, 
              message: 'Request was cancelled',
              details: { aborted: true }
            };
          }
          
          return { 
            success: false, 
            message: `Database connection failed: ${testError.message}`,
            details: testError
          };
        }

        // Test RLS policies
        const { data: rlsTest, error: rlsError } = await supabase
          .from('waitlist_users')
          .select('id, email, is_verified')
          .limit(1);
          
        if (rlsError) {
          // Check for abort error
          if (isAbortError(rlsError)) {
            return { 
              success: false, 
              message: 'Request was cancelled',
              details: { aborted: true }
            };
          }
          
          return { 
            success: false, 
            message: `RLS policy test failed: ${rlsError.message}`,
            details: rlsError
          };
        }

        // Test token search capability
        const { data: tokenTest, error: tokenError } = await supabase
          .from('waitlist_users')
          .select('verification_token')
          .not('verification_token', 'is', null)
          .limit(1);
          
        if (tokenError) {
          // Check for abort error
          if (isAbortError(tokenError)) {
            return { 
              success: false, 
              message: 'Request was cancelled',
              details: { aborted: true }
            };
          }
          
          return { 
            success: false, 
            message: `Token search test failed: ${tokenError.message}`,
            details: tokenError
          };
        }

        return { 
          success: true, 
          message: 'Database connection successful',
          details: { 
            hasData: rlsTest && rlsTest.length > 0,
            hasTokens: tokenTest && tokenTest.length > 0,
            rowCount: rlsTest?.length || 0
          }
        };
      },
      { 
        success: false, 
        message: 'Connection test failed',
        details: { fallback: true }
      },
      'testDatabaseConnection'
    );
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
          }
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
    const fallbackStats = {
      totalUsers: 0,
      verifiedUsers: 0,
      completedQuizzes: 0
    };

    // Return fallback stats if Supabase is not configured
    if (!isSupabaseConfigured) {
      return fallbackStats;
    }

    // Check if the signal is already aborted before making the request
    if (signal?.aborted) {
      return fallbackStats;
    }

    return await safeApiCall(
      async () => {
        // Use the Supabase client with proper abort signal handling
        const { data, error } = await supabase
          .from('waitlist_users')
          .select('is_verified, quiz_completed')
          .abortSignal(signal);

        if (error) {
          // Check for abort error here too
          if (isAbortError(error)) {
            return fallbackStats;
          }
          throw error;
        }

        const totalUsers = data.length;
        const verifiedUsers = data.filter(user => user.is_verified).length;
        const completedQuizzes = data.filter(user => user.quiz_completed).length;

        return { totalUsers, verifiedUsers, completedQuizzes };
      },
      fallbackStats,
      'getWaitlistStats'
    );
  }

  static async getUserByEmail(email: string): Promise<WaitlistUser | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    return await safeApiCall(
      async () => {
        const { data, error } = await supabase
          .from('waitlist_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          // Check for abort error
          if (isAbortError(error)) {
            return null;
          }
          throw error;
        }

        return data;
      },
      null,
      'getUserByEmail'
    );
  }
}