/// <reference path="../types.ts" />
import { Resend } from 'npm:resend@3.2.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
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
    // SECURITY FIX: Only get API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
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

    // Get site URL with secure fallback
    let siteUrl = Deno.env.get('SITE_URL');
    if (!siteUrl) {
      // Try to extract from request headers as fallback
      const origin = req.headers.get('origin');
      const referer = req.headers.get('referer');
      
      if (origin && origin.includes('purrfectstays')) {
        siteUrl = origin;
      } else if (referer && referer.includes('purrfectstays')) {
        try {
          const refererUrl = new URL(referer);
          siteUrl = `${refererUrl.protocol}//${refererUrl.host}`;
        } catch (e) {
          console.error('Failed to parse referer URL:', e);
        }
      }
      
      // Final secure fallback
      if (!siteUrl) {
        siteUrl = 'https://purrfectstays.org';
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
    const waitlistPosition = parseInt(requestBody.waitlistPosition);
    const userType = requestBody.userType;

    const resend = new Resend(resendApiKey);

    // Try custom domain first, fallback to default Resend domain if it fails
    let emailResult;
    let fromAddress = 'Purrfect Stays <hello@purrfectstays.org>';
    
    try {
      emailResult = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: `🎉 Welcome to Purrfect Stays! You're #${waitlistPosition} in Line`,
        html: getWelcomeEmailTemplate(name, waitlistPosition, userType, siteUrl, email),
      });
      
      if (emailResult.error) {
        throw new Error(`Custom domain failed: ${emailResult.error.message}`);
      }
    } catch (customDomainError) {
      console.log('Custom domain failed, trying default Resend domain');
      
      // Fallback to default Resend domain
      fromAddress = 'Purrfect Stays <onboarding@resend.dev>';
      
      emailResult = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: `🎉 Welcome to Purrfect Stays! You're #${waitlistPosition} in Line`,
        html: getWelcomeEmailTemplate(name, waitlistPosition, userType, siteUrl, email),
      });
      
      if (emailResult.error) {
        throw new Error(`Email sending failed: ${emailResult.error.message}`);
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

function getWelcomeEmailTemplate(name: string, waitlistPosition: number, userType: string, siteUrl: string, email: string): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#22c55e' : '#8b5cf6';
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Purrfect Stays!</title>
      <style>
        /* Base styles */
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #0f172a; 
          color: #e2e8f0;
          line-height: 1.6;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        /* Header styles */
        .header { 
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); 
          padding: 48px 32px; 
          text-align: center; 
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="confetti" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="white" opacity="0.2"/><circle cx="2" cy="8" r="0.5" fill="white" opacity="0.2"/><circle cx="8" cy="2" r="0.5" fill="white" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23confetti)"/></svg>');
          opacity: 0.8;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: white;
          border-radius: 16px;
          padding: 12px;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .header h1 { 
          color: white; 
          margin: 0; 
          font-size: 28px; 
          font-weight: 800; 
          position: relative;
          z-index: 1;
        }
        .header .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          margin: 12px 0 0 0;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }
        
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0f172a">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#1e293b" style="border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
              <!-- Header -->
              <tr>
                <td class="header" align="center" style="padding: 48px 32px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); position: relative;">
                  <div style="position: relative; z-index: 1;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <div class="logo" style="width: 80px; height: 80px; margin: 0 auto 16px; background: white; border-radius: 16px; padding: 12px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">
                            <!-- FIX: Use a reliable image hosting service instead of relative path -->
                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">🐱</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to Purrfect Stays!</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p class="subtitle" style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 12px 0 0 0; font-weight: 500;">You're officially part of our early access community</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div class="position-badge" style="background: white; color: #22c55e; font-size: 32px; font-weight: 800; width: 120px; height: 120px; line-height: 120px; border-radius: 60px; margin: 24px auto; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); display: inline-block; text-align: center;">
                            #${waitlistPosition}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 48px 32px; background: #1e293b;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <!-- Celebration Section -->
                    <tr>
                      <td>
                        <div class="celebration-section" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0; color: white; position: relative; overflow: hidden;">
                          <div style="position: relative; z-index: 1;">
                            <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800;">Congratulations, ${name}! 🎉</h2>
                            <p style="margin: 0; font-size: 18px; opacity: 0.95;">
                              You've secured position <strong>#${waitlistPosition}</strong> in our exclusive early access program.
                              <div class="user-type-badge" style="display: inline-block; background: ${userTypeColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin: 16px 0;">
                                ${userTypeEmoji} ${userTypeLabel}
                              </div>
                            </p>
                          </div>
                        </div>
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
                        <!-- FIX: Use a reliable image hosting service instead of relative path -->
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0 auto 16px;">🐱</div>
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