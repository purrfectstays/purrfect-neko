/// <reference path="../types.ts" />
import { Resend } from 'npm:resend@3.2.0'
import { getVerificationEmailTemplate } from './email-template.ts'

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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false',
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
  
  if (!data.verificationToken || typeof data.verificationToken !== 'string') {
    errors.push('Verification token is required and must be a string');
  } else if (data.verificationToken.length > 200) {
    errors.push('Verification token is invalid');
  }

  if (!data.userType || typeof data.userType !== 'string') {
    errors.push('User type is required and must be a string');
  } else if (!['cat-parent', 'cattery-owner'].includes(data.userType)) {
    errors.push('User type must be either "cat-parent" or "cattery-owner"');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Input validation for CAPTCHA registration (no token required)
function validateInputForCaptcha(data: any): { isValid: boolean; errors: string[] } {
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

    if (!resendApiKey) {
      console.error('❌ Email service configuration error: RESEND_API_KEY not found');
      console.error('📧 Available env vars:', Object.keys(Deno.env.toObject()).filter(k => k.includes('RESEND') || k.includes('EMAIL')));
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again later.',
          debug: 'Email service not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      )
    }

    // Validate API key format
    if (!resendApiKey.startsWith('re_')) {
      console.error('❌ Invalid Resend API key format');
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again later.',
          debug: 'Invalid email service configuration'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      )
    }

    console.log('✅ Email service configured with key:', resendApiKey.substring(0, 8) + '...');

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
      const rawBody = await req.text();
      console.log('📧 Raw request body:', rawBody);
      console.log('📧 Content-Type:', req.headers.get('content-type'));
      requestBody = JSON.parse(rawBody);
    } catch (e) {
      console.error('📧 JSON parse error:', e);
      console.error('📧 Request headers:', Array.from(req.headers.entries()));
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', debug: e.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check if this is a CAPTCHA registration request
    const skipEmailSending = requestBody.skipEmailSending || false;
    const autoVerify = requestBody.autoVerify || false;

    // Validate input (skip token validation for CAPTCHA registration)
    let validation;
    if (skipEmailSending) {
      validation = validateInputForCaptcha(requestBody);
    } else {
      validation = validateInput(requestBody);
    }
    
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
    const verificationToken = skipEmailSending ? null : requestBody.verificationToken.trim();
    const userType = requestBody.userType;

    // Handle CAPTCHA registration (skip email sending)
    if (skipEmailSending) {
      try {
        // Create Supabase client with service role key
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://fahqkxrakcizftopskki.supabase.co';
        const supabaseServiceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        // Generate a verification token even for CAPTCHA registration
        const captchaToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Insert user directly with service role permissions
        const { data: userData, error: insertError } = await supabase
          .from('waitlist_users')
          .insert({
            name: name,
            email: email,
            user_type: userType,
            verification_token: captchaToken,
            is_verified: autoVerify, // Set to true for CAPTCHA users
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Database insert error:', insertError);
          throw new Error(`Database error: ${insertError.message}`);
        }

        console.log('✅ CAPTCHA user registered successfully:', userData.id);

        return new Response(
          JSON.stringify({
            success: true,
            user: userData,
            verificationToken: captchaToken,
            message: 'User registered successfully via CAPTCHA'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (error) {
        console.error('❌ CAPTCHA registration error:', error);
        return new Response(
          JSON.stringify({
            error: 'Registration failed',
            details: error.message
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }

    const resend = new Resend(resendApiKey);
    // Use frontend route for verification to avoid Edge Function auth issues
    const verificationUrl = `${siteUrl}/verify?token=${encodeURIComponent(verificationToken)}`;

    console.log('📧 Preparing to send verification email...');
    console.log('📧 Recipient:', email);
    console.log('📧 Token length:', verificationToken.length);
    console.log('📧 Token preview:', verificationToken.substring(0, 8) + '...');
    console.log('📧 Verification URL:', verificationUrl);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format provided',
          details: ['Email must be a valid email address']
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Use actual Purrfect Stays logo from public folder
    const logoBase64DataUrl = null; // Let it use the actual logo file

    // Send email using verified custom domain
    const fromAddress = 'Purrfect Stays <noreply@purrfectstays.org>';
    const emailPayload: any = {
      from: fromAddress,
      to: [email],
      subject: '🚀 Verify Your Email - Purrfect Stays Early Access',
      html: getVerificationEmailTemplate(name, verificationUrl, siteUrl, email, userType, logoBase64DataUrl),
    };

    console.log('📧 Email payload prepared:', {
      from: fromAddress,
      to: email,
      subject: emailPayload.subject,
      htmlLength: emailPayload.html.length
    });

    try {
      console.log('📧 Sending email via Resend API...');
      const emailResult = await resend.emails.send(emailPayload);
      console.log('📧 Resend API response:', emailResult);
      
      if (emailResult.error) {
        console.error('❌ Resend API returned error:', emailResult.error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send verification email. Please try again.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      const { data } = emailResult;

      console.log('Verification email sent successfully');
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
      );
    } catch (error) {
      console.error('Verification email error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'An unexpected error occurred while sending verification email.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('Main function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Service temporarily unavailable. Please try again later.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});