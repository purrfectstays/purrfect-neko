/// <reference path="../types.ts" />
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
      'http://localhost:3000'
    ];
  }
  
  // For development, be more permissive with localhost
  const isDevelopment = origin && origin.includes('localhost');
  const allowedOrigin = isDevelopment && allowedOrigins.includes(origin) 
    ? origin 
    : origin && allowedOrigins.includes(origin) 
      ? origin 
      : 'https://purrfectstays.org';
  
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
function validateInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!data.waitlistPosition || typeof data.waitlistPosition !== 'number') {
    errors.push('Waitlist position is required and must be a number');
  }
  
  if (!data.userType || typeof data.userType !== 'string') {
    errors.push('User type is required and must be a string');
  } else if (!['cat-parent', 'cattery-owner'].includes(data.userType)) {
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

    // SECURITY: Validate request timing to prevent replay attacks
    const timestamp = req.headers.get('x-timestamp');
    if (timestamp) {
      const requestTime = parseInt(timestamp);
      const currentTime = Date.now();
      if (Math.abs(currentTime - requestTime) > 300000) { // 5 minutes
        return new Response(
          JSON.stringify({ error: 'Request timestamp invalid' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
    }

    // SECURITY FIX: Only get API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    console.log('🔑 RESEND_API_KEY status:', {
      exists: !!resendApiKey,
      length: resendApiKey?.length || 0,
      startsWithRe: resendApiKey?.startsWith('re_') || false
    });

    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      console.error('📝 Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ 
          error: 'Email service configuration error. Please contact support.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // FORCE production URL for all email links
    let siteUrl = 'https://purrfectstays.org';
    
    // Allow localhost for development
    const requestOrigin = req.headers.get('origin');
    if (requestOrigin && requestOrigin.includes('localhost')) {
      siteUrl = requestOrigin;
    } else {
      // Ensure the URL has a protocol for production
      if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
        siteUrl = `https://${siteUrl}`;
      }
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
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
    const waitlistPosition = Math.max(1, parseInt(requestBody.waitlistPosition) || 1); // Ensure minimum position of 1
    const userType = requestBody.userType;
    
    console.log('📧 Processing welcome email for:', {
      email: email,
      name: name,
      waitlistPosition: waitlistPosition,
      userType: userType
    });

    const resend = new Resend(resendApiKey);

    // Use actual Purrfect Stays logo from public folder
    const logoBase64DataUrl = null; // Let it use the actual logo file
    console.log('📷 Using actual Purrfect Stays logo from public folder');

    // Prepare email payload
    const emailPayload: any = {
      to: [email],
      subject: `🎉 Welcome to Purrfect Stays! You're #${waitlistPosition} in Line`,
      html: getWelcomeEmailTemplate(name, waitlistPosition, userType, siteUrl, email, logoBase64DataUrl),
    };

    // Try custom domain first, fallback to Resend's default domain
    let emailResult;
    let fromAddress = 'Purrfect Stays <hello@purrfectstays.org>';
    
    console.log('📧 Attempting to send welcome email with payload:', {
      to: emailPayload.to,
      subject: emailPayload.subject,
      from: fromAddress
    });
    
    try {
      console.log('📧 Trying custom domain: hello@purrfectstays.org');
      emailResult = await resend.emails.send({
        ...emailPayload,
        from: fromAddress,
      });
      
      console.log('📧 Custom domain result:', emailResult);
      
      if (emailResult.error) {
        console.error('❌ Custom domain error:', emailResult.error);
        throw new Error(`Custom domain failed: ${emailResult.error.message}`);
      }
    } catch (customDomainError) {
      console.error('❌ Custom domain failed with details:', {
        error: customDomainError,
        message: customDomainError.message,
        stack: customDomainError.stack,
        name: customDomainError.name
      });
      console.log('🔄 Trying Resend default domain: onboarding@resend.dev');
      
      // Fallback to Resend's default domain (always works)
      fromAddress = 'Purrfect Stays <onboarding@resend.dev>';
      
      emailResult = await resend.emails.send({
        ...emailPayload,
        from: fromAddress,
      });
      
      console.log('📧 Resend default domain result:', emailResult);
      
      if (emailResult.error) {
        console.error('❌ Resend default domain error:', emailResult.error);
        throw new Error(`Email sending failed with Resend default: ${emailResult.error.message}`);
      }
    }

    const { data, error } = emailResult;

    if (error) {
      console.error('Welcome email error:', error);
      
      // Handle rate limit errors specifically
      if (error.message?.includes('Too many requests') || error.message?.includes('rate limit')) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            type: 'rate_limit'
          }),
          {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': '1'
            },
            status: 429,
          }
        )
      }
      
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id,
        note: fromAddress.includes('resend.dev') ? 'Sent using default domain. Custom domain verification needed.' : 'Sent using custom domain.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Welcome email error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred while sending welcome email.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})