export function getVerificationEmailTemplate(
  name: string, 
  verificationUrl: string, 
  siteUrl: string, 
  email: string,
  userType: string,
  logoDataUrl: string | null
): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#10b981' : '#8b5cf6'; // green-500 or purple-500
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  // Always use production site for logo assets
  const logoBaseSite = 'https://purrfectstays.org';
  const logoSrc = logoDataUrl || `${logoBaseSite}/logo-email.png`;
  
  // Optimized email template with proper alignment and responsiveness
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="format-detection" content="date=no" />
  <meta name="format-detection" content="address=no" />
  <meta name="format-detection" content="email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Verify Your Email - Purrfect Stays</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset and base styles */
    * { box-sizing: border-box; }
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    
    /* Prevent auto-linking */
    *[x-apple-data-detectors], .unstyle-auto-detected-links *, .aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    
    /* Reset margins and padding */
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; }
    table { border-collapse: collapse !important; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Responsive utilities */
    .mobile-hide { display: table-cell; }
    .mobile-show { display: none; }
    
    /* Desktop styles */
    @media screen and (min-width: 600px) {
      .container { width: 600px !important; }
      .mobile-hide { display: table-cell !important; }
      .mobile-show { display: none !important; }
    }
    
    /* Mobile styles */
    @media screen and (max-width: 599px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-hide { display: none !important; }
      .mobile-show { display: table-cell !important; }
      .mobile-center { text-align: center !important; }
      .mobile-full-width { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
      .mobile-small-padding { padding: 15px !important; }
      .mobile-font-size { font-size: 14px !important; line-height: 1.4 !important; }
      .mobile-title { font-size: 24px !important; line-height: 1.2 !important; }
      .mobile-subtitle { font-size: 16px !important; line-height: 1.3 !important; }
      .mobile-button { padding: 12px 24px !important; font-size: 15px !important; }
      .mobile-icon-size { width: 32px !important; height: 32px !important; }
      .mobile-logo-container { width: 60px !important; height: 60px !important; padding: 10px !important; }
      .mobile-logo { width: 40px !important; height: 40px !important; }
    }
    
    /* Ultra small screens */
    @media screen and (max-width: 480px) {
      .ultra-mobile-padding { padding: 15px !important; }
      .ultra-mobile-small-padding { padding: 10px !important; }
      .ultra-mobile-font-size { font-size: 13px !important; }
      .ultra-mobile-title { font-size: 22px !important; }
      .ultra-mobile-button { padding: 10px 20px !important; font-size: 14px !important; }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #0f172a !important; }
      .dark-card-bg { background-color: #1e293b !important; }
      .dark-text { color: #e2e8f0 !important; }
    }
    
    /* Outlook-specific fixes */
    <!--[if mso]>
    table { font-family: Arial, sans-serif; }
    .outlook-fix { mso-line-height-rule: exactly; }
    <![endif]-->
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; width: 100%; min-width: 100%;" class="dark-bg">
  
  <!-- Preheader text (hidden but shows in preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #0f172a;">
    Verify your email to join Purrfect Stays early access community
  </div>
  
  <!-- Main container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; min-width: 100%;" class="dark-bg">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <!-- Email container -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);" class="dark-card-bg">
          
          <!-- Header section -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;" class="mobile-padding">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <!-- Logo container -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.15); border-radius: 20px; padding: 16px;" class="mobile-logo-container">
                          <img src="${logoSrc}" alt="Purrfect Stays" width="48" height="48" style="display: block; width: 48px; height: 48px; border-radius: 8px;" class="mobile-logo" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: white; margin: 0 0 12px 0; font-size: 28px; font-weight: 800; line-height: 1.2; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-title ultra-mobile-title">
                      Verify Your Email
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; font-weight: 500; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-subtitle">
                      You're one step away from early access
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 40px 20px;" class="mobile-padding">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                
                <!-- Greeting -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 20px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                      Hi ${name}! 👋
                    </h2>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 0; line-height: 1.6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size ultra-mobile-font-size">
                      Welcome to the <span style="color: #a5b4fc; font-weight: 600;">Purrfect Stays</span> early access community! 
                      We're thrilled to have you join us as we revolutionize cattery bookings.
                    </p>
                  </td>
                </tr>
                
                <!-- User type badge -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: ${userTypeColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                          ${userTypeEmoji} ${userTypeLabel}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Verification CTA section -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px;">
                      <tr>
                        <td style="padding: 32px 20px; text-align: center;" class="mobile-small-padding">
                          
                          <!-- Email icon -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                            <tr>
                              <td align="center" style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                <span style="color: white; font-size: 28px; line-height: 64px;">✉️</span>
                              </td>
                            </tr>
                          </table>
                          
                          <h3 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 20px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                            Confirm Your Email Address
                          </h3>
                          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px 0; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size ultra-mobile-font-size">
                            Click the button below to verify your email and access your personalized onboarding quiz
                          </p>
                          
                          <!-- CTA Button -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                              <td align="center" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; mso-padding-alt: 16px 32px;">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationUrl}" style="height:52px;v-text-anchor:middle;width:200px;" arcsize="23%" fillcolor="#6366f1">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">✨ Verify My Email</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="${verificationUrl}" style="display: inline-block; color: white; text-decoration: none; padding: 16px 32px; font-weight: 700; font-size: 16px; border-radius: 12px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; line-height: 1;" class="mobile-button ultra-mobile-button">
                                  ✨ Verify My Email
                                </a>
                                <!--<![endif]-->
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Benefits preview -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h3 style="color: #a5b4fc; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size">
                      What Awaits You:
                    </h3>
                    
                    <!-- Benefit items in mobile-friendly layout -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top; width: 40px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                <span style="color: white; font-size: 16px; line-height: 32px;">🎯</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Shape the Platform
                          </p>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Your feedback directly influences our development
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 8px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                <span style="color: white; font-size: 16px; line-height: 32px;">⚡</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Early Beta Access
                          </p>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Be the first to try new features before launch
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 32px; height: 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                <span style="color: white; font-size: 16px; line-height: 32px;">💎</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                          <p style="color: #e2e8f0; font-weight: 600; margin: 0 0 4px 0; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Exclusive Community
                          </p>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Join our founding members in shaping the future
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Urgency note -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px;">
                      <tr>
                        <td style="padding: 16px 20px; text-align: center;" class="mobile-small-padding">
                          <p style="color: white; font-size: 14px; margin: 0; font-weight: 600; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            ⏰ <strong>Limited Time:</strong> Early access spots are filling up fast. Verify now to secure your position!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Alternative verification link -->
                <tr>
                  <td style="padding-bottom: 24px; text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      Having trouble with the button?
                    </p>
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.4; word-break: break-all; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      Copy and paste this link: <br>
                      <a href="${verificationUrl}" style="color: #6366f1; text-decoration: none;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(15, 23, 42, 0.9); padding: 24px 20px; text-align: center; border-top: 1px solid rgba(99, 102, 241, 0.2);" class="mobile-small-padding">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 8px; text-align: center; vertical-align: middle;">
                          <img src="${logoSrc}" alt="Purrfect Stays" width="32" height="32" style="display: block; width: 32px; height: 32px; margin: 0 auto;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 12px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      © 2025 Purrfect Stays. All rights reserved.
                    </p>
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      You received this email because you signed up for early access.<br>
                      <a href="${siteUrl}/unsubscribe?email=${email}" style="color: #6366f1; text-decoration: none;">Unsubscribe</a> | 
                      <a href="${siteUrl}/privacy" style="color: #6366f1; text-decoration: none;">Privacy</a> | 
                      <a href="${siteUrl}/terms" style="color: #6366f1; text-decoration: none;">Terms</a>
                    </p>
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
</html>`;
}