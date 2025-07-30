import '../types.ts';
import { Resend } from 'npm:resend@3.2.0'
import { getWelcomeEmailTemplate } from './email-template.ts'

// Environment-driven CORS configuration
function getCorsHeaders(origin: string | null): Record<string, string> {
  // Get allowed origins from environment variables
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  const siteUrl = Deno.env.get('SITE_URL') || 'https://purrfectstays.org';
  
  let allowedOrigins: string[];
  
  if (envOrigins) {
    // Parse comma-separated origins from environment
    allowedOrigins = envOrigins.split(',').map(url => url.trim());
  } else {
    // Fallback to default origins
    allowedOrigins = [
      siteUrl,
      'https://purrfectstays.org',
      'https://www.purrfectstays.org',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:3000'
    ];
  }
  
  // For development, be more permissive with localhost
  const isDevelopment = origin && origin.includes('localhost');
  
  let allowedOrigin: string;
  
  if (isDevelopment) {
    // Always allow localhost origins in development
    allowedOrigin = origin;
    console.log('🔧 Development mode - allowing origin:', origin);
  } else if (origin && allowedOrigins.includes(origin)) {
    // Allow explicitly listed origins
    allowedOrigin = origin;
    console.log('✅ Production mode - allowing listed origin:', origin);
  } else {
    // Default fallback
    allowedOrigin = 'https://purrfectstays.org';
    console.log('⚠️ Using default origin. Requested:', origin, 'Allowed:', allowedOrigins);
  }
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept, x-requested-with, cache-control, pragma',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false',
    'Vary': 'Origin',
  };
}

// Input sanitization function
function sanitizeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, (match) => {
    const entities: Record<string, string> = { 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#39;',
      '&': '&amp;'
    };
    return entities[match] || match;
  });
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Input validation function
function validateInput(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const inputData = data as Record<string, unknown>;
  
  if (!inputData.email || typeof inputData.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!isValidEmail(inputData.email)) {
    errors.push('Invalid email format');
  }
  
  if (!inputData.name || typeof inputData.name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (inputData.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!inputData.waitlistPosition || typeof inputData.waitlistPosition !== 'number') {
    errors.push('Waitlist position is required and must be a number');
  }
  
  if (!inputData.userType || typeof inputData.userType !== 'string') {
    errors.push('User type is required and must be a string');
  } else if (!['cat-parent', 'cattery-owner'].includes(inputData.userType)) {
    errors.push('User type must be either "cat-parent" or "cattery-owner"');
  }
  
  return { isValid: errors.length === 0, errors };
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    )
  }

  try {
    // CRITICAL FIX: Check for API key first
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('❌ CRITICAL: RESEND_API_KEY not found in environment variables');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()).filter(k => !k.includes('KEY')));
      
      // Return user-friendly error
      return new Response(
        JSON.stringify({ 
          error: 'Email service is temporarily unavailable. Please contact support.',
          code: 'EMAIL_SERVICE_UNAVAILABLE',
          details: 'Missing API configuration'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      )
    }

    // SECURITY: Validate API key (allow anon key for public access)
    const authHeader = req.headers.get('authorization');
    const apiKeyHeader = req.headers.get('apikey');
    
    if (!authHeader && !apiKeyHeader) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing authorization header',
          code: 401,
          message: 'Missing authorization header'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }
    
    // Extract token from Authorization header or apikey header
    const token = authHeader?.replace('Bearer ', '') || apiKeyHeader;
    const expectedAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    // Explicitly check we're NOT using service role key
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (token === serviceRoleKey) {
      console.error('🚨 SECURITY: Attempted to use service role key in Edge Function!');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authorization token',
          code: 401
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }
    
    if (!token || !expectedAnonKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authentication configuration',
          code: 401
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }
    
    // Validate token - accept either anon key or valid JWT
    const isValidAnonKey = token === expectedAnonKey;
    const isJWT = token.includes('.') && token.split('.').length === 3;
    
    if (!isValidAnonKey && !isJWT) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authorization token',
          code: 401
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }
    
    console.log('🔐 Authentication successful:', { 
      isAnonKey: isValidAnonKey, 
      isJWT: isJWT && !isValidAnonKey 
    });

    // SECURITY: Add basic request validation and rate limiting
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10000) {
      return new Response(
        JSON.stringify({ error: 'Request payload too large' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 413,
        }
      )
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate input
    const validation = validateInput(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          details: validation.errors
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Sanitize inputs
    const email = requestBody.email.trim().toLowerCase();
    const name = sanitizeHtml(requestBody.name.trim());
    const waitlistPosition = Math.max(1, parseInt(requestBody.waitlistPosition) || 1);
    const userType = requestBody.userType;
    
    console.log('📧 Processing welcome email for:', {
      email: email,
      name: name,
      waitlistPosition: waitlistPosition,
      userType: userType
    });

    // CRITICAL: Validate Resend API key format
    if (!resendApiKey.startsWith('re_')) {
      console.error('❌ Invalid RESEND_API_KEY format - must start with "re_"');
      return new Response(
        JSON.stringify({ 
          error: 'Email service configuration error',
          code: 'INVALID_API_KEY_FORMAT'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    const resend = new Resend(resendApiKey);

    // Force production URL for all email links
    let siteUrl = 'https://purrfectstays.org';
    
    // Allow localhost for development
    const requestOrigin = req.headers.get('origin');
    if (requestOrigin && requestOrigin.includes('localhost')) {
      siteUrl = requestOrigin;
    }

    // Prepare email payload
    const emailHtml = getWelcomeEmailTemplate(name, waitlistPosition, userType, siteUrl, email, null);
    
    const emailPayload = {
      to: [email],
      subject: `🎉 Welcome to Purrfect Stays! You're #${waitlistPosition} in Line`,
      html: emailHtml,
    };

    // Try custom domain first, then fallback to Resend default
    let emailResult;
    let fromAddress = 'Purrfect Stays <hello@purrfectstays.org>';
    
    try {
      console.log('📧 Attempting to send from custom domain:', fromAddress);
      emailResult = await resend.emails.send({
        ...emailPayload,
        from: fromAddress,
      });
      
      if (emailResult.error) {
        throw new Error(emailResult.error.message);
      }
    } catch (customError) {
      console.log('⚠️ Custom domain failed, using Resend default:', customError.message);
      
      // Fallback to Resend default domain
      fromAddress = 'Purrfect Stays <onboarding@resend.dev>';
      try {
        emailResult = await resend.emails.send({
          ...emailPayload,
          from: fromAddress,
        });
      } catch (fallbackError) {
        console.error('❌ Both email attempts failed:', fallbackError);
        
        // Check if it's a rate limit error
        if (fallbackError.message?.includes('rate limit') || fallbackError.message?.includes('Too many requests')) {
          return new Response(
            JSON.stringify({ 
              error: 'Too many email requests. Please try again in a few minutes.',
              type: 'rate_limit'
            }),
            {
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Retry-After': '60'
              },
              status: 429,
            }
          )
        }
        
        throw fallbackError;
      }
    }

    // Check final result
    if (emailResult?.error) {
      console.error('❌ Email sending failed:', emailResult.error);
      throw new Error(emailResult.error.message || 'Email sending failed');
    }

    const { data } = emailResult;
    console.log('✅ Email sent successfully:', {
      messageId: data?.id,
      from: fromAddress,
      to: email
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id,
        note: fromAddress.includes('resend.dev') ? 'Sent using Resend default domain' : 'Sent using custom domain'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    console.error('Stack trace:', error.stack);
    
    // Provide detailed error response for debugging
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send welcome email',
        message: error.message || 'An unexpected error occurred',
        code: 'EMAIL_SEND_FAILED'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})