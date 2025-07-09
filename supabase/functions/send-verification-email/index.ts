/// <reference path="../types.ts" />
import { Resend } from 'npm:resend@3.2.0'

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
  return str.replace(/[<>\"'&]/g, (match) => {
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

    // Use environment-driven site URL configuration
    let siteUrl = Deno.env.get('SITE_URL') || 'https://purrfectstays.org';
    
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
    const verificationToken = requestBody.verificationToken.trim();
    const userType = requestBody.userType;

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
      html: getEmailTemplate(name, verificationUrl, siteUrl, email, userType, logoBase64DataUrl),
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

function getEmailTemplate(name: string, verificationUrl: string, siteUrl: string, email: string, userType: string, logoDataUrl: string | null): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#22c55e' : '#8b5cf6';
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  // Use base64 data URL if available, otherwise fallback to hosted logo
  // Always use deployed site for logo assets, even during development
  const logoBaseSite = 'https://purrfect-landingpage.netlify.app';
  const logoSrc = logoDataUrl || `${logoBaseSite}/logo-email.png`;
  
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <title>Verify Your Email - Purrfect Stays</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Base styles for email client compatibility */
        * {
          box-sizing: border-box;
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: #0f172a !important; 
          color: #e2e8f0 !important;
          line-height: 1.6 !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* Outlook-specific fixes */
        table {
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
        }
        
        img {
          border: 0 !important;
          height: auto !important;
          line-height: 100% !important;
          outline: none !important;
          text-decoration: none !important;
          -ms-interpolation-mode: bicubic !important;
          max-width: 100% !important;
        }
        
        .container { 
          max-width: 600px !important; 
          margin: 0 auto !important; 
          background-color: #1e293b !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        /* Header styles with better mobile support */
        .header { 
          background-color: #6366f1 !important;
          background-image: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important; 
          padding: 40px 20px !important; 
          text-align: center !important; 
        }
        
        .logo-container {
          width: 80px !important;
          height: 80px !important;
          margin: 0 auto 20px auto !important;
          background-color: white !important;
          border-radius: 16px !important;
          padding: 12px !important;
          display: block !important;
        }
        
        .logo-image {
          width: 56px !important;
          height: 56px !important;
          display: block !important;
          margin: 0 auto !important;
        }
        
        .header-title { 
          color: white !important; 
          margin: 0 0 12px 0 !important; 
          font-size: 28px !important; 
          font-weight: 800 !important; 
          line-height: 1.2 !important;
        }
        
        .header-subtitle {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 18px !important;
          margin: 0 !important;
          font-weight: 500 !important;
          line-height: 1.4 !important;
        }
        
        /* Content styles with better spacing */
        .content { 
          padding: 40px 20px !important; 
          background-color: #1e293b !important;
        }
        
        .greeting {
          font-size: 20px !important;
          color: #e2e8f0 !important;
          margin: 0 0 24px 0 !important;
          font-weight: 600 !important;
        }
        
        .message {
          font-size: 16px !important;
          color: #cbd5e1 !important;
          margin: 0 0 24px 0 !important;
          line-height: 1.6 !important;
        }
        
        .highlight {
          color: #a5b4fc !important;
          font-weight: 600 !important;
        }
        
        /* User type badge with better mobile support */
        .user-type-badge {
          display: inline-block !important;
          background-color: ${userTypeColor} !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 25px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin: 20px 0 !important;
          text-align: center !important;
        }
        
        /* Verification box with improved responsiveness */
        .verification-box {
          background-color: #6366f1 !important;
          background-image: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          border-radius: 12px !important;
          padding: 32px 20px !important;
          text-align: center !important;
          margin: 32px 0 !important;
        }
        
        .verification-title {
          color: white !important;
          margin: 0 0 16px 0 !important;
          font-size: 22px !important;
          font-weight: 700 !important;
        }
        
        .verification-text {
          color: rgba(255,255,255,0.9) !important;
          margin: 0 0 24px 0 !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
        }
        
        /* Button with enhanced compatibility */
        .verify-button { 
          display: inline-block !important; 
          background-color: white !important;
          color: #6366f1 !important; 
          text-decoration: none !important; 
          padding: 16px 32px !important; 
          border-radius: 12px !important; 
          font-weight: 700 !important; 
          font-size: 16px !important;
          text-align: center !important;
          line-height: 1.2 !important;
          border: none !important;
          mso-hide: all !important;
        }
        
        /* Responsive media queries */
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          
          .header {
            padding: 30px 16px !important;
          }
          
          .content {
            padding: 30px 16px !important;
          }
          
          .header-title {
            font-size: 24px !important;
          }
          
          .header-subtitle {
            font-size: 16px !important;
          }
          
          .greeting {
            font-size: 18px !important;
          }
          
          .message {
            font-size: 15px !important;
          }
          
          .verification-box {
            padding: 24px 16px !important;
            margin: 24px 0 !important;
          }
          
          .verification-title {
            font-size: 20px !important;
          }
          
          .verification-text {
            font-size: 15px !important;
          }
          
          .verify-button {
            padding: 14px 24px !important;
            font-size: 16px !important;
            display: block !important;
            width: 80% !important;
            margin: 0 auto !important;
            max-width: 280px !important;
          }
          
          .user-type-badge {
            padding: 8px 16px !important;
            font-size: 13px !important;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .header {
            padding: 24px 12px !important;
          }
          
          .content {
            padding: 24px 12px !important;
          }
          
          .header-title {
            font-size: 22px !important;
          }
          
          .logo-container {
            width: 70px !important;
            height: 70px !important;
            padding: 10px !important;
          }
          
          .logo-image {
            width: 50px !important;
            height: 50px !important;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .container {
            background-color: #1e293b !important;
          }
        }
      </style>
    </head>
    <body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!--[if mso]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td class="header" align="center" style="padding: 40px 20px; background-color: #6366f1; background-image: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                  <table border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" class="logo-container" style="width: 80px; height: 80px; background-color: white; border-radius: 16px; padding: 12px; margin: 0 auto 20px auto; display: block;">
                              <img src="${logoSrc}" alt="Purrfect Stays Logo" class="logo-image" style="width: 56px; height: 56px; display: block; margin: 0 auto; border: 0;">
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <h1 class="header-title" style="color: white; margin: 0 0 12px 0; font-size: 28px; font-weight: 800; line-height: 1.2;">Verify Your Email</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <p class="header-subtitle" style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0; font-weight: 500; line-height: 1.4;">One step away from early access</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 40px 20px; background-color: #1e293b;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    
                    <!-- Greeting -->
                    <tr>
                      <td>
                        <h2 class="greeting" style="font-size: 20px; color: #e2e8f0; margin: 0 0 24px 0; font-weight: 600;">Hi ${name},</h2>
                      </td>
                    </tr>
                    
                    <!-- Main Message -->
                    <tr>
                      <td>
                        <p class="message" style="font-size: 16px; color: #cbd5e1; margin: 0 0 24px 0; line-height: 1.6;">
                          Thank you for joining the Purrfect Stays early access community! We're excited to have you on board as we build the future of cattery bookings.
                          <span class="highlight" style="color: #a5b4fc; font-weight: 600;"> Please verify your email address to secure your spot.</span>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- User Type Badge -->
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="user-type-badge" style="background-color: ${userTypeColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; text-align: center;">
                              ${userTypeEmoji} ${userTypeLabel}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Verification Box -->
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <table class="verification-box" border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: #6366f1; background-image: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; max-width: 500px;">
                          <tr>
                            <td style="padding: 32px 20px; text-align: center;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <h3 class="verification-title" style="color: white; margin: 0 0 16px 0; font-size: 22px; font-weight: 700;">Confirm Your Email</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <p class="verification-text" style="color: rgba(255,255,255,0.9); margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">Click the button below to verify your email and continue to your personalized quiz</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td style="border-radius: 12px; background-color: white;">
                                          <a href="${verificationUrl}" class="verify-button" style="display: inline-block; background-color: white; color: #6366f1; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; text-align: center; line-height: 1.2; border: none;">
                                            Verify My Email
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Benefits Section -->
                    <tr>
                      <td style="padding: 20px 0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px;">
                          <tr>
                            <td style="padding: 24px 20px;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <h3 style="color: #a5b4fc; margin: 0 0 20px 0; font-size: 18px; font-weight: 700;">Your Early Access Benefits:</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                      <tr>
                                        <td style="padding: 8px 0; vertical-align: top; width: 40px;">
                                          <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td style="width: 32px; height: 32px; background-color: #6366f1; border-radius: 8px; text-align: center; line-height: 32px; font-weight: bold; font-size: 14px; color: white;">1</td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td style="padding: 8px 0 8px 16px; vertical-align: top;">
                                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 15px;">Shape the Platform</p>
                                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Your feedback directly influences our development</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 8px 0; vertical-align: top;">
                                          <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td style="width: 32px; height: 32px; background-color: #6366f1; border-radius: 8px; text-align: center; line-height: 32px; font-weight: bold; font-size: 14px; color: white;">2</td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td style="padding: 8px 0 8px 16px; vertical-align: top;">
                                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 15px;">Early Beta Access</p>
                                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Be the first to try new features before launch</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 8px 0; vertical-align: top;">
                                          <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td style="width: 32px; height: 32px; background-color: #6366f1; border-radius: 8px; text-align: center; line-height: 32px; font-weight: bold; font-size: 14px; color: white;">3</td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td style="padding: 8px 0 8px 16px; vertical-align: top;">
                                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 15px;">Exclusive Community</p>
                                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Join our founding members in shaping the future</p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Urgency Note -->
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f59e0b; background-image: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px;">
                          <tr>
                            <td style="padding: 20px; text-align: center; color: white; font-weight: 600; font-size: 15px; line-height: 1.4;">
                              ⏰ <strong>Limited Spots Available:</strong> Verify your email now to secure your position in our exclusive early access program.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px;">
                          <tr>
                            <td style="padding: 20px; text-align: center;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <h4 style="color: #22c55e; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Need Help?</h4>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <p style="color: #cbd5e1; margin: 0 0 16px 0; font-size: 14px; line-height: 1.4;">
                                      If you have any questions or need assistance, our team is here to help.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td style="border-radius: 8px; background-color: #22c55e;">
                                          <a href="mailto:support@purrfectstays.org" style="display: inline-block; background-color: #22c55e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                            Contact Support
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Disclaimer -->
                    <tr>
                      <td style="padding: 20px 0 0 0;">
                        <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6; text-align: center;">
                          If you didn't request this email, you can safely ignore it. No account will be created without email verification.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0f172a; padding: 32px 20px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #334155;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="width: 40px; height: 40px; background-color: white; border-radius: 8px; padding: 4px; margin: 0 auto 16px auto; display: block;">
                              <img src="${logoSrc}" alt="Purrfect Stays" style="width: 32px; height: 32px; display: block; margin: 0 auto; border: 0; border-radius: 4px;">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 16px 0; color: #64748b;">© 2025 Purrfect Stays. All rights reserved.</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 0 4px;">
                              <a href="${siteUrl}/social/twitter" style="display: inline-block; width: 32px; height: 32px; background-color: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">𝕏</a>
                            </td>
                            <td style="padding: 0 4px;">
                              <a href="${siteUrl}/social/facebook" style="display: inline-block; width: 32px; height: 32px; background-color: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">f</a>
                            </td>
                            <td style="padding: 0 4px;">
                              <a href="${siteUrl}/social/instagram" style="display: inline-block; width: 32px; height: 32px; background-color: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">📷</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 24px; border-top: 1px solid #334155;">
                        <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.4;">
                          You received this email because you signed up for early access to Purrfect Stays.<br>
                          <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #6366f1; text-decoration: none;">Unsubscribe</a> | 
                          <a href="${siteUrl}/privacy" style="color: #6366f1; text-decoration: none;">Privacy Policy</a> | 
                          <a href="${siteUrl}/terms" style="color: #6366f1; text-decoration: none;">Terms of Service</a> | 
                          <a href="${siteUrl}/cookies" style="color: #6366f1; text-decoration: none;">Cookie Policy</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  return template;
}