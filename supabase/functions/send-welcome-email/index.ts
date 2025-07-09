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
      : 'https://purrfect-landingpage.netlify.app';
  
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

    // Use environment-driven site URL configuration
    let siteUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
    
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

function getWelcomeEmailTemplate(name: string, waitlistPosition: number, userType: string, siteUrl: string, email: string, logoDataUrl: string | null): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#22c55e' : '#8b5cf6';
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  // Use base64 data URL if available, otherwise fallback to hosted logo
  // Always use deployed site for logo assets, even during development
  const logoBaseSite = 'https://purrfect-landingpage.netlify.app';
  const logoSrc = logoDataUrl || `${logoBaseSite}/logo-email.png`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <title>Welcome to Purrfect Stays!</title>
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
          background-color: #22c55e !important;
          background-image: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important; 
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
          margin: 0 0 20px 0 !important;
          font-weight: 500 !important;
          line-height: 1.4 !important;
        }
        
        /* Position badge */
        .position-badge {
          background-color: white !important;
          color: #22c55e !important;
          font-size: 32px !important;
          font-weight: 800 !important;
          width: 120px !important;
          height: 120px !important;
          line-height: 120px !important;
          border-radius: 60px !important;
          margin: 0 auto !important;
          text-align: center !important;
          display: block !important;
        }
        
        /* Content styles with better spacing */
        .content { 
          padding: 40px 20px !important; 
          background-color: #1e293b !important;
        }
        
        .section-title {
          font-size: 24px !important;
          color: #e2e8f0 !important;
          margin: 0 0 20px 0 !important;
          font-weight: 700 !important;
          text-align: center !important;
        }
        
        .message {
          font-size: 16px !important;
          color: #cbd5e1 !important;
          margin: 0 0 24px 0 !important;
          line-height: 1.6 !important;
          text-align: center !important;
        }
        
        .highlight {
          color: #22c55e !important;
          font-weight: 600 !important;
        }
        
        /* User type badge */
        .user-type-badge {
          display: inline-block !important;
          background-color: ${userTypeColor} !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 25px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin: 10px 0 !important;
          text-align: center !important;
        }
        
        /* Section boxes */
        .section-box {
          background-color: rgba(99, 102, 241, 0.1) !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
          border-radius: 12px !important;
          padding: 24px 20px !important;
          margin: 20px 0 !important;
        }
        
        .green-box {
          background-color: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
        }
        
        .orange-box {
          background-color: #f59e0b !important;
          background-image: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: white !important;
        }
        
        .purple-box {
          background-color: rgba(139, 92, 246, 0.1) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Button styles */
        .primary-button {
          display: inline-block !important;
          background-color: #6366f1 !important;
          background-image: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: white !important;
          text-decoration: none !important;
          padding: 14px 28px !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          text-align: center !important;
          line-height: 1.2 !important;
          border: none !important;
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
          
          .section-title {
            font-size: 20px !important;
          }
          
          .message {
            font-size: 15px !important;
          }
          
          .section-box {
            padding: 20px 16px !important;
            margin: 16px 0 !important;
          }
          
          .position-badge {
            width: 100px !important;
            height: 100px !important;
            line-height: 100px !important;
            font-size: 28px !important;
          }
          
          .user-type-badge {
            padding: 8px 16px !important;
            font-size: 13px !important;
          }
          
          .primary-button {
            padding: 12px 24px !important;
            font-size: 15px !important;
            display: block !important;
            width: 80% !important;
            margin: 0 auto !important;
            max-width: 280px !important;
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
          
          .position-badge {
            width: 90px !important;
            height: 90px !important;
            line-height: 90px !important;
            font-size: 24px !important;
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
        
        /* Position badge */
        .position-badge {
          background: white;
          color: #22c55e;
          font-size: 32px;
          font-weight: 800;
          width: 120px;
          height: 120px;
          line-height: 120px;
          border-radius: 60px;
          margin: 24px auto;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .position-badge::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 65px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          z-index: -1;
          opacity: 0.5;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        
        /* Content styles */
        .content { 
          padding: 48px 32px; 
          background: #1e293b;
        }
        .greeting {
          font-size: 20px;
          color: #e2e8f0;
          margin: 0 0 24px 0;
        }
        .message {
          font-size: 16px;
          color: #cbd5e1;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }
        .highlight {
          color: #a5b4fc;
          font-weight: 600;
        }
        
        /* Celebration section */
        .celebration-section {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .celebration-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="confetti" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="white" opacity="0.2"/><circle cx="2" cy="8" r="0.5" fill="white" opacity="0.2"/><circle cx="8" cy="2" r="0.5" fill="white" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23confetti)"/></svg>');
          opacity: 0.8;
        }
        .celebration-section h2 {
          margin: 0 0 16px 0;
          font-size: 28px;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }
        .celebration-section p {
          margin: 0;
          font-size: 18px;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }
        
        /* User type badge */
        .user-type-badge {
          display: inline-block;
          background: ${userTypeColor};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 16px 0;
          position: relative;
          z-index: 1;
        }
        
        /* Benefits section */
        .benefits-section {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 32px;
          margin: 32px 0;
        }
        .benefits-section h3 {
          color: #a5b4fc;
          margin: 0 0 24px 0;
          font-size: 22px;
          font-weight: 700;
          text-align: center;
        }
        .benefit-card {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
        }
        .benefit-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .benefit-card-icon {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-weight: bold;
          font-size: 18px;
        }
        .benefit-card-title {
          color: #22c55e;
          font-weight: 700;
          font-size: 18px;
          margin: 0;
        }
        .benefit-card-description {
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0;
          font-size: 14px;
        }
        
        /* Share section */
        .share-section {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .share-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="white" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
          opacity: 0.8;
        }
        .share-section h3 {
          margin: 0 0 16px 0;
          font-size: 24px;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }
        .share-section p {
          margin: 0 0 24px 0;
          position: relative;
          z-index: 1;
        }
        .share-link {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          word-break: break-all;
          color: white;
          font-family: monospace;
          position: relative;
          z-index: 1;
        }
        .share-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 24px 0;
          position: relative;
          z-index: 1;
        }
        .share-button {
          background: white;
          color: #f59e0b;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        /* Timeline section */
        .timeline {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 32px;
          margin: 32px 0;
        }
        .timeline h3 {
          color: #c4b5fd;
          margin: 0 0 24px 0;
          font-size: 22px;
          font-weight: 700;
          text-align: center;
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;
          padding: 16px 0;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }
        .timeline-item:last-child {
          border-bottom: none;
        }
        .timeline-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
          font-weight: bold;
          font-size: 14px;
        }
        .timeline-content h4 {
          color: #e2e8f0;
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }
        .timeline-content p {
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
          font-size: 14px;
        }
        
        /* Button styles */
        .primary-button {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          margin: 24px 0;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        /* Footer styles */
        .footer { 
          background: #0f172a; 
          padding: 32px; 
          text-align: center; 
          color: #64748b; 
          font-size: 14px; 
          border-top: 1px solid #334155;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-link {
          display: inline-block;
          margin: 0 8px;
          width: 32px;
          height: 32px;
          background: #334155;
          border-radius: 50%;
          line-height: 32px;
          text-align: center;
          color: white;
          text-decoration: none;
          font-size: 16px;
        }
        .unsubscribe {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #334155;
          font-size: 12px;
          color: #64748b;
        }
        .unsubscribe a {
          color: #6366f1;
          text-decoration: none;
        }
        
        /* Support section */
        .support-section {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          text-align: center;
        }
        .support-section h4 {
          color: #22c55e;
          margin: 0 0 12px 0;
          font-size: 20px;
        }
        .support-section p {
          color: #cbd5e1;
          margin: 0 0 16px 0;
        }
        .support-button {
          display: inline-block;
          background: #22c55e;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin: 8px;
          transition: all 0.3s ease;
        }
        
        /* Email client compatibility fixes */
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .content {
            padding: 24px 16px !important;
          }
          .header {
            padding: 32px 16px !important;
          }
          .celebration-section, .benefits-section, .share-section, .timeline {
            padding: 24px 16px !important;
          }
          .share-buttons {
            flex-direction: column !important;
            align-items: center !important;
          }
          .share-button {
            width: 80% !important;
            justify-content: center !important;
          }
          .position-badge {
            width: 100px !important;
            height: 100px !important;
            line-height: 100px !important;
            font-size: 28px !important;
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
                <td class="header" align="center" style="padding: 40px 20px; background-color: #22c55e; background-image: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);">
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
                              <h1 class="header-title" style="color: white; margin: 0 0 12px 0; font-size: 28px; font-weight: 800; line-height: 1.2;">Welcome to Purrfect Stays!</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <p class="header-subtitle" style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0 0 20px 0; font-weight: 500; line-height: 1.4;">You're officially part of our early access community</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td class="position-badge" style="background-color: white; color: #22c55e; font-size: 32px; font-weight: 800; width: 120px; height: 120px; line-height: 120px; border-radius: 60px; text-align: center;">
                                    #${waitlistPosition}
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
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 40px 20px; background-color: #1e293b;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    
                    <!-- Celebration Section -->
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color: #22c55e; background-image: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px;">
                          <tr>
                            <td style="padding: 32px 20px; text-align: center; color: white;">
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <h2 class="section-title" style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: white;">Congratulations, ${name}! 🎉</h2>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <p class="message" style="margin: 0 0 20px 0; font-size: 18px; color: rgba(255,255,255,0.95); line-height: 1.5;">
                                      You've secured position <strong>#${waitlistPosition}</strong> in our exclusive early access program.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td class="user-type-badge" style="background-color: ${userTypeColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; text-align: center;">
                                          ${userTypeEmoji} ${userTypeLabel}
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
                      <td>
                        <div class="benefits-section" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 32px; margin: 32px 0;">
                          <h3 style="color: #a5b4fc; margin: 0 0 24px 0; font-size: 22px; font-weight: 700; text-align: center;">Your Exclusive Benefits</h3>
                          
                          <div class="benefit-card" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin: 16px 0;">
                            <div class="benefit-card-header" style="display: flex; align-items: center; margin-bottom: 12px;">
                              <div class="benefit-card-icon" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; margin-right: 16px; font-weight: bold; font-size: 18px;">💎</div>
                              <h4 class="benefit-card-title" style="color: #22c55e; font-weight: 700; font-size: 18px; margin: 0; display: inline-block; vertical-align: middle;">Lifetime Benefits</h4>
                            </div>
                            <p class="benefit-card-description" style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 14px;">
                              Lock in permanent benefits and special recognition that will never be offered again after our public launch.
                            </p>
                          </div>
                          
                          <div class="benefit-card" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin: 16px 0;">
                            <div class="benefit-card-header" style="display: flex; align-items: center; margin-bottom: 12px;">
                              <div class="benefit-card-icon" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; margin-right: 16px; font-weight: bold; font-size: 18px;">🎯</div>
                              <h4 class="benefit-card-title" style="color: #22c55e; font-weight: 700; font-size: 18px; margin: 0; display: inline-block; vertical-align: middle;">Shape the Platform</h4>
                            </div>
                            <p class="benefit-card-description" style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 14px;">
                              Your feedback directly shapes our features and roadmap. You're not just a user – you're a co-creator.
                            </p>
                          </div>
                          
                          <div class="benefit-card" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin: 16px 0;">
                            <div class="benefit-card-header" style="display: flex; align-items: center; margin-bottom: 12px;">
                              <div class="benefit-card-icon" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; width: 40px; height: 40px; border-radius: 10px; display: inline-block; text-align: center; line-height: 40px; margin-right: 16px; font-weight: bold; font-size: 18px;">⚡</div>
                              <h4 class="benefit-card-title" style="color: #22c55e; font-weight: 700; font-size: 18px; margin: 0; display: inline-block; vertical-align: middle;">Early Beta Access</h4>
                            </div>
                            <p class="benefit-card-description" style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 14px;">
                              Be the first to try new features before anyone else, starting with our beta launch in Q4 2025.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Share Section -->
                    <tr>
                      <td>
                        <div class="share-section" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0; color: white; position: relative; overflow: hidden;">
                          <div style="position: relative; z-index: 1;">
                            <h3 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">Share With Fellow Cat Lovers</h3>
                            <p style="margin: 0 0 24px 0;">
                              Help us build the ultimate platform for the cat community by sharing Purrfect Stays with others!
                            </p>
                            
                            <div class="share-link" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin: 20px 0; word-break: break-all; color: white; font-family: monospace;">
                              ${siteUrl}?ref=${waitlistPosition}
                            </div>
                            
                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                              <tr>
                                <td align="center">
                                  <div class="share-buttons" style="margin: 24px 0;">
                                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just secured spot #${waitlistPosition} on the Purrfect Stays early access waitlist! 🐱 Revolutionary cattery booking platform launching in 2026. Join me!`)}&url=${encodeURIComponent(siteUrl + '?ref=' + waitlistPosition)}" class="share-button" style="display: inline-block; background: white; color: #f59e0b; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; margin: 0 8px;">
                                      🐦 Share on Twitter
                                    </a>
                                    <a href="mailto:?subject=${encodeURIComponent('Check out Purrfect Stays!')}&body=${encodeURIComponent(`I just joined the Purrfect Stays early access waitlist and I'm #${waitlistPosition}! This revolutionary cattery booking platform launching in 2026 is exactly what the cat community needs. Join me: ${siteUrl}?ref=${waitlistPosition}`)}" class="share-button" style="display: inline-block; background: white; color: #f59e0b; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; margin: 0 8px;">
                                      📧 Share via Email
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Timeline Section -->
                    <tr>
                      <td>
                        <div class="timeline" style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 32px; margin: 32px 0;">
                          <h3 style="color: #c4b5fd; margin: 0 0 24px 0; font-size: 22px; font-weight: 700; text-align: center;">Your Journey Ahead</h3>
                          
                          <div class="timeline-item" style="display: flex; align-items: flex-start; margin: 20px 0; padding: 16px 0; border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
                            <div class="timeline-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-block; text-align: center; line-height: 36px; margin-right: 16px; font-weight: bold; font-size: 14px;">✅</div>
                            <div class="timeline-content" style="display: inline-block; vertical-align: top;">
                              <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Now: Welcome to the Community</h4>
                              <p style="color: #94a3b8; margin: 0; line-height: 1.5; font-size: 14px;">You're officially in! Start sharing to help us build the ultimate cat community platform.</p>
                            </div>
                          </div>
                          
                          <div class="timeline-item" style="display: flex; align-items: flex-start; margin: 20px 0; padding: 16px 0; border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
                            <div class="timeline-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-block; text-align: center; line-height: 36px; margin-right: 16px; font-weight: bold; font-size: 14px;">📊</div>
                            <div class="timeline-content" style="display: inline-block; vertical-align: top;">
                              <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Q4 2025: Beta Testing Begins</h4>
                              <p style="color: #94a3b8; margin: 0; line-height: 1.5; font-size: 14px;">First access to our platform. Test features, provide feedback, and help us perfect the experience.</p>
                            </div>
                          </div>
                          
                          <div class="timeline-item" style="display: flex; align-items: flex-start; margin: 20px 0; padding: 16px 0; border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
                            <div class="timeline-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-block; text-align: center; line-height: 36px; margin-right: 16px; font-weight: bold; font-size: 14px;">🚀</div>
                            <div class="timeline-content" style="display: inline-block; vertical-align: top;">
                              <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Q1 2026: Full Platform Launch</h4>
                              <p style="color: #94a3b8; margin: 0; line-height: 1.5; font-size: 14px;">Public launch with your lifetime benefits activated and all premium features unlocked.</p>
                            </div>
                          </div>
                          
                          <div class="timeline-item" style="display: flex; align-items: flex-start; margin: 20px 0; padding: 16px 0;">
                            <div class="timeline-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-block; text-align: center; line-height: 36px; margin-right: 16px; font-weight: bold; font-size: 14px;">🏆</div>
                            <div class="timeline-content" style="display: inline-block; vertical-align: top;">
                              <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Ongoing: Founder's Circle Benefits</h4>
                              <p style="color: #94a3b8; margin: 0; line-height: 1.5; font-size: 14px;">Continued influence over new features, exclusive events, and recognition as a founding member.</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Return to Homepage -->
                    <tr>
                      <td align="center">
                        <a href="${siteUrl}" class="primary-button" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 16px; margin: 24px 0; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);">
                          Return to Homepage
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                      <td>
                        <div class="support-section" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 24px; margin: 32px 0; text-align: center;">
                          <h4 style="color: #22c55e; margin: 0 0 12px 0; font-size: 20px;">Questions? We're Here to Help!</h4>
                          <p style="color: #cbd5e1; margin: 0 0 16px 0;">
                            Our team is ready to assist with any questions about your early access membership.
                          </p>
                          <a href="mailto:hello@purrfectstays.org?subject=Welcome - Position ${waitlistPosition}&body=Hi! I just received my welcome email for position #${waitlistPosition}. I have a question about..." class="support-button" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 8px;">
                            Contact Support
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="color: #94a3b8; font-size: 14px; margin: 32px 0 0 0; line-height: 1.6;">
                          <strong>What's next?</strong> Keep an eye on your inbox for exclusive updates, beta invitations, and opportunities 
                          to influence our development. We'll be in touch soon with exciting news about our progress.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer" style="background: #0f172a; padding: 32px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #334155;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <div style="width: 40px; height: 40px; background: white; border-radius: 8px; padding: 4px; margin: 0 auto 16px; display: inline-flex; align-items: center; justify-content: center;">
                          <img src="${logoSrc}" alt="Purrfect Stays" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 16px 0;">© 2025 Purrfect Stays. All rights reserved.</p>
                        <p style="margin: 0 0 16px 0; color: #475569;">
                          Early Access Member #${waitlistPosition} | Founder's Circle
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="social-links" style="margin: 20px 0;">
                          <a href="${siteUrl}/social/twitter" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 16px;">
                            🐦
                          </a>
                          <a href="${siteUrl}/social/facebook" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 16px;">
                            📘
                          </a>
                          <a href="${siteUrl}/social/instagram" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 16px;">
                            📷
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="unsubscribe" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
                          <p style="margin: 0;">
                            You received this email because you completed the Purrfect Stays waitlist signup.<br>
                            <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #6366f1; text-decoration: none;">Unsubscribe</a> | 
                            <a href="${siteUrl}/privacy" style="color: #6366f1; text-decoration: none;">Privacy Policy</a> | 
                            <a href="${siteUrl}/terms" style="color: #6366f1; text-decoration: none;">Terms of Service</a> | 
                            <a href="${siteUrl}/cookies" style="color: #6366f1; text-decoration: none;">Cookie Policy</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}