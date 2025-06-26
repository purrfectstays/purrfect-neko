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

    // Get site URL with better localhost detection
    let siteUrl = Deno.env.get('SITE_URL');
    if (!siteUrl) {
      // Try to extract from request headers as fallback
      const origin = req.headers.get('origin');
      const referer = req.headers.get('referer');
      
      // Prioritize localhost for development
      if (origin && origin.includes('localhost')) {
        siteUrl = origin;
      } else if (referer && referer.includes('localhost')) {
        try {
          const refererUrl = new URL(referer);
          siteUrl = `${refererUrl.protocol}//${refererUrl.host}`;
        } catch (e) {
          console.error('Failed to parse referer URL:', e);
        }
      } else if (origin && origin.includes('purrfectstays')) {
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
        siteUrl = 'https://purrfect-neko.vercel.app';
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
    const verificationToken = requestBody.verificationToken.trim();
    const userType = requestBody.userType;

    const resend = new Resend(resendApiKey);
    // IMPORTANT: Fix the verification URL to use the correct path
    const verificationUrl = `${siteUrl}/verify?token=${encodeURIComponent(verificationToken)}`;

    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);

    // Send email using the production domain
    const fromAddress = 'Purrfect Stays <hello@purrfectstays.org>';
    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: '🚀 Verify Your Email - Purrfect Stays Early Access',
      html: getEmailTemplate(name, verificationUrl, siteUrl, email, userType),
    });
    
    if (emailResult.error) {
      throw new Error(`Email sending failed: ${emailResult.error.message}`);
    }

    const { data, error } = emailResult;

    if (error) {
      console.error('Resend API error:', error);
      
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
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send verification email. Please try again.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

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
    )
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
    )
  }
})

function getEmailTemplate(name: string, verificationUrl: string, siteUrl: string, email: string, userType: string): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#22c55e' : '#8b5cf6';
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Purrfect Stays</title>
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
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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
        
        /* Verification box styles */
        .verification-box {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          position: relative;
          overflow: hidden;
        }
        .verification-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
        }
        .verification-box h3 {
          color: white;
          margin: 0 0 16px 0;
          font-size: 22px;
          position: relative;
          z-index: 1;
        }
        .verification-box p {
          color: rgba(255,255,255,0.9);
          margin: 0 0 24px 0;
          position: relative;
          z-index: 1;
        }
        
        /* Button styles */
        .verify-button { 
          display: inline-block; 
          background: white;
          color: #6366f1; 
          text-decoration: none; 
          padding: 16px 32px; 
          border-radius: 12px; 
          font-weight: 700; 
          font-size: 16px;
          margin: 0;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
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
        }
        
        /* Benefits section */
        .benefits-section {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
        }
        .benefits-section h3 {
          color: #a5b4fc;
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 700;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          margin: 16px 0;
        }
        .benefit-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
          font-weight: bold;
          font-size: 14px;
        }
        .benefit-content {
          flex: 1;
        }
        .benefit-title {
          color: #e2e8f0;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .benefit-description {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }
        
        /* Urgency note */
        .urgency-note {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin: 32px 0;
          font-weight: 600;
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
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }
        .support-section h4 {
          color: #22c55e;
          margin: 0 0 12px 0;
          font-size: 18px;
        }
        .support-section p {
          color: #cbd5e1;
          margin: 0 0 16px 0;
          font-size: 14px;
        }
        .support-button {
          display: inline-block;
          background: #22c55e;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
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
          .verification-box {
            padding: 24px 16px !important;
          }
          .verify-button {
            padding: 14px 20px !important;
            font-size: 16px !important;
            display: block !important;
            margin: 0 auto !important;
            width: 80% !important;
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
                <td class="header" align="center" style="padding: 48px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); position: relative;">
                  <div style="position: relative; z-index: 1;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <div class="logo" style="width: 80px; height: 80px; margin: 0 auto 16px; background: white; border-radius: 16px; padding: 12px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);">
                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">🐱</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Verify Your Email</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p class="subtitle" style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 12px 0 0 0; font-weight: 500;">One step away from early access</p>
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
                    <tr>
                      <td>
                        <h2 class="greeting" style="font-size: 20px; color: #e2e8f0; margin: 0 0 24px 0;">Hi ${name},</h2>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p class="message" style="font-size: 16px; color: #cbd5e1; margin: 0 0 24px 0; line-height: 1.6;">
                          Thank you for joining the Purrfect Stays early access community! We're excited to have you on board as we build the future of cattery bookings.
                          <span class="highlight" style="color: #a5b4fc; font-weight: 600;"> Please verify your email address to secure your spot.</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="user-type-badge" style="display: inline-block; background: ${userTypeColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin: 16px 0;">
                          ${userTypeEmoji} ${userTypeLabel}
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Verification Box -->
                    <tr>
                      <td>
                        <div class="verification-box" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0; position: relative; overflow: hidden;">
                          <div style="position: relative; z-index: 1;">
                            <h3 style="color: white; margin: 0 0 16px 0; font-size: 22px;">Confirm Your Email</h3>
                            <p style="color: rgba(255,255,255,0.9); margin: 0 0 24px 0;">Click the button below to verify your email and continue to your personalized quiz</p>
                            <a href="${verificationUrl}" class="verify-button" style="display: inline-block; background: white; color: #6366f1; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);">
                              Verify My Email
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Benefits Section -->
                    <tr>
                      <td>
                        <div class="benefits-section" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 24px; margin: 32px 0;">
                          <h3 style="color: #a5b4fc; margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">Your Early Access Benefits:</h3>
                          
                          <div class="benefit-item" style="display: flex; align-items: flex-start; margin: 16px 0;">
                            <div class="benefit-icon" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 32px; height: 32px; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 16px; flex-shrink: 0; font-weight: bold; font-size: 14px;">1</div>
                            <div class="benefit-content" style="display: inline-block; vertical-align: top;">
                              <p class="benefit-title" style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0;">Shape the Platform</p>
                              <p class="benefit-description" style="color: #94a3b8; font-size: 14px; margin: 0;">Your feedback directly influences our development</p>
                            </div>
                          </div>
                          
                          <div class="benefit-item" style="display: flex; align-items: flex-start; margin: 16px 0;">
                            <div class="benefit-icon" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 32px; height: 32px; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 16px; flex-shrink: 0; font-weight: bold; font-size: 14px;">2</div>
                            <div class="benefit-content" style="display: inline-block; vertical-align: top;">
                              <p class="benefit-title" style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0;">Early Beta Access</p>
                              <p class="benefit-description" style="color: #94a3b8; font-size: 14px; margin: 0;">Be the first to try new features before launch</p>
                            </div>
                          </div>
                          
                          <div class="benefit-item" style="display: flex; align-items: flex-start; margin: 16px 0;">
                            <div class="benefit-icon" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 32px; height: 32px; border-radius: 8px; display: inline-block; text-align: center; line-height: 32px; margin-right: 16px; flex-shrink: 0; font-weight: bold; font-size: 14px;">3</div>
                            <div class="benefit-content" style="display: inline-block; vertical-align: top;">
                              <p class="benefit-title" style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0;">Exclusive Community</p>
                              <p class="benefit-description" style="color: #94a3b8; font-size: 14px; margin: 0;">Join our founding members in shaping the future</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Urgency Note -->
                    <tr>
                      <td>
                        <div class="urgency-note" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 32px 0; font-weight: 600;">
                          ⏰ <strong>Limited Spots Available:</strong> Verify your email now to secure your position in our exclusive early access program.
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                      <td>
                        <div class="support-section" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
                          <h4 style="color: #22c55e; margin: 0 0 12px 0; font-size: 18px;">Need Help?</h4>
                          <p style="color: #cbd5e1; margin: 0 0 16px 0; font-size: 14px;">
                            If you have any questions or need assistance, our team is here to help.
                          </p>
                          <a href="mailto:support@purrfectstays.org" class="support-button" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 8px;">
                            Contact Support
                          </a>
                        </div>
                      </td>
                    </tr>
                    
                    <tr>
                      <td>
                        <p style="color: #94a3b8; font-size: 14px; margin: 32px 0 0 0; line-height: 1.6;">
                          If you didn't request this email, you can safely ignore it. No account will be created without email verification.
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
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0 auto 16px;">🐱</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 16px 0;">© 2025 Purrfect Stays. All rights reserved.</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="social-links" style="margin: 20px 0;">
                          <a href="${siteUrl}/social/twitter" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">
                            𝕏
                          </a>
                          <a href="${siteUrl}/social/facebook" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">
                            f
                          </a>
                          <a href="${siteUrl}/social/instagram" class="social-link" style="display: inline-block; margin: 0 8px; width: 32px; height: 32px; background: #334155; border-radius: 50%; line-height: 32px; text-align: center; color: white; text-decoration: none; font-size: 14px;">
                            📷
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <div class="unsubscribe" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
                          <p style="margin: 0;">
                            You received this email because you signed up for early access to Purrfect Stays.<br>
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