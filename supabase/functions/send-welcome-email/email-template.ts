export function getWelcomeEmailTemplate(
  name: string, 
  waitlistPosition: number, 
  userType: string, 
  siteUrl: string, 
  email: string,
  logoDataUrl: string | null
): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#10b981' : '#8b5cf6'; // green-500 or purple-500
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  // Always use production site for logo assets
  const logoBaseSite = 'https://purrfectstays.org';
  const logoSrc = logoDataUrl || `${logoBaseSite}/logo-email.png`;
  
  // Optimized welcome email template with proper alignment and responsiveness
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
  <title>Welcome to Purrfect Stays!</title>
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
      .mobile-position-badge { width: 80px !important; height: 80px !important; font-size: 24px !important; line-height: 80px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
    
    /* Ultra small screens */
    @media screen and (max-width: 480px) {
      .ultra-mobile-padding { padding: 15px !important; }
      .ultra-mobile-small-padding { padding: 10px !important; }
      .ultra-mobile-font-size { font-size: 13px !important; }
      .ultra-mobile-title { font-size: 22px !important; }
      .ultra-mobile-button { padding: 10px 20px !important; font-size: 14px !important; }
      .ultra-mobile-position-badge { width: 70px !important; height: 70px !important; font-size: 20px !important; line-height: 70px !important; }
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
    Welcome to Purrfect Stays! You're #${waitlistPosition} in our early access community.
  </div>
  
  <!-- Main container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; min-width: 100%;" class="dark-bg">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <!-- Email container -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);" class="dark-card-bg">
          
          <!-- Header section -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;" class="mobile-padding">
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
                      Welcome to Purrfect Stays!
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0 0 20px 0; font-weight: 500; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-subtitle">
                      You're officially part of our early access community
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <!-- Position badge -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width: 100px; height: 100px; background-color: rgba(255, 255, 255, 0.95); border-radius: 50px; text-align: center; vertical-align: middle; font-size: 28px; font-weight: 800; color: #10b981; line-height: 100px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-position-badge ultra-mobile-position-badge">
                          #${waitlistPosition}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 40px 20px;" class="mobile-padding">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                
                <!-- Celebration message -->
                <tr>
                  <td style="padding-bottom: 32px; text-align: center;">
                    <h2 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 24px; font-weight: 800; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                      Congratulations, ${name}! 🎉
                    </h2>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size ultra-mobile-font-size">
                      You've secured position <span style="color: #10b981; font-weight: 700; background-color: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 4px;">#${waitlistPosition}</span> in our exclusive early access program.
                    </p>
                    
                    <!-- User type badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: ${userTypeColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                          ${userTypeEmoji} ${userTypeLabel}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Benefits section -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px;">
                      <tr>
                        <td style="padding: 24px 20px;" class="mobile-small-padding">
                          <h3 style="color: #a5b4fc; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size">
                            Your Exclusive Benefits
                          </h3>
                          
                          <!-- Benefit items -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 12px 0; vertical-align: top; width: 48px;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 10px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                      <span style="color: white; font-size: 20px; line-height: 40px;">💎</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="padding: 12px 0 12px 12px; vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 6px 0; font-size: 16px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                                  Lifetime Benefits
                                </h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                                  Lock in permanent perks and founder recognition that will never be offered again after our public launch.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; vertical-align: top;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                      <span style="color: white; font-size: 20px; line-height: 40px;">🎯</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="padding: 12px 0 12px 12px; vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 6px 0; font-size: 16px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                                  Shape the Platform
                                </h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                                  Your feedback directly influences our development roadmap. You're not just a user – you're a co-creator.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; vertical-align: top;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 10px; text-align: center; vertical-align: middle;" class="mobile-icon-size">
                                      <span style="color: white; font-size: 20px; line-height: 40px;">⚡</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="padding: 12px 0 12px 12px; vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 6px 0; font-size: 16px; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text mobile-font-size">
                                  Beta Access
                                </h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                                  Be the first to try new features before anyone else, starting with our beta launch in Q4 2025.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Timeline section -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <h3 style="color: #a5b4fc; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size">
                      Your Journey Ahead
                    </h3>
                    
                    <!-- Timeline items -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top; width: 40px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 30px; height: 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; text-align: center; vertical-align: middle;">
                                <span style="color: white; font-size: 14px; line-height: 30px; font-weight: bold;">✓</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Now: Welcome to the Community
                          </h4>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            You're officially in! Start sharing to help us build the ultimate cat community.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 30px; height: 30px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; text-align: center; vertical-align: middle;">
                                <span style="color: white; font-size: 12px; line-height: 30px; font-weight: bold;">2</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Q4 2025: Beta Testing
                          </h4>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            First access to our platform. Test features and help us perfect the experience.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width: 30px; height: 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; text-align: center; vertical-align: middle;">
                                <span style="color: white; font-size: 12px; line-height: 30px; font-weight: bold;">🚀</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="dark-text ultra-mobile-font-size">
                            Q1 2026: Full Launch
                          </h4>
                          <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Public launch with your lifetime benefits activated and founder status recognized.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Share section -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px 20px; text-align: center;" class="mobile-small-padding">
                          <h3 style="color: white; margin: 0 0 12px 0; font-size: 18px; font-weight: 800; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size">
                            Share with Fellow Cat Lovers
                          </h3>
                          <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Help us build the ultimate platform for the cat community!
                          </p>
                          
                          <!-- Share link -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                            <tr>
                              <td style="background-color: rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 12px; text-align: center;">
                                <p style="color: white; font-family: monospace; font-size: 12px; margin: 0; word-break: break-all; line-height: 1.3;" class="ultra-mobile-font-size">
                                  ${siteUrl}?ref=${waitlistPosition}
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Share buttons -->
                          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                              <td style="padding: 0 6px;" class="mobile-stack">
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="background-color: rgba(255, 255, 255, 0.2); border-radius: 6px; mso-padding-alt: 8px 16px;">
                                      <!--[if mso]>
                                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just secured spot #${waitlistPosition} on the Purrfect Stays early access waitlist! 🐱`)}&url=${encodeURIComponent(siteUrl + '?ref=' + waitlistPosition)}" style="height:32px;v-text-anchor:middle;width:80px;" arcsize="19%" fillcolor="rgba(255,255,255,0.2)">
                                      <w:anchorlock/>
                                      <center style="color:#ffffff;font-family:sans-serif;font-size:12px;font-weight:600;">🐦 Twitter</center>
                                      </v:roundrect>
                                      <![endif]-->
                                      <!--[if !mso]><!-->
                                      <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just secured spot #${waitlistPosition} on the Purrfect Stays early access waitlist! 🐱`)}&url=${encodeURIComponent(siteUrl + '?ref=' + waitlistPosition)}" style="display: inline-block; color: white; text-decoration: none; padding: 8px 16px; font-weight: 600; font-size: 12px; border-radius: 6px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        🐦 Twitter
                                      </a>
                                      <!--<![endif]-->
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="padding: 0 6px;" class="mobile-stack">
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="background-color: rgba(255, 255, 255, 0.2); border-radius: 6px; mso-padding-alt: 8px 16px;">
                                      <!--[if mso]>
                                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:?subject=${encodeURIComponent('Check out Purrfect Stays!')}&body=${encodeURIComponent(`I just joined the Purrfect Stays early access waitlist and I'm #${waitlistPosition}! Join me: ${siteUrl}?ref=${waitlistPosition}`)}" style="height:32px;v-text-anchor:middle;width:80px;" arcsize="19%" fillcolor="rgba(255,255,255,0.2)">
                                      <w:anchorlock/>
                                      <center style="color:#ffffff;font-family:sans-serif;font-size:12px;font-weight:600;">📧 Email</center>
                                      </v:roundrect>
                                      <![endif]-->
                                      <!--[if !mso]><!-->
                                      <a href="mailto:?subject=${encodeURIComponent('Check out Purrfect Stays!')}&body=${encodeURIComponent(`I just joined the Purrfect Stays early access waitlist and I'm #${waitlistPosition}! Join me: ${siteUrl}?ref=${waitlistPosition}`)}" style="display: inline-block; color: white; text-decoration: none; padding: 8px 16px; font-weight: 600; font-size: 12px; border-radius: 6px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                        📧 Email
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
                    </table>
                  </td>
                </tr>
                
                <!-- CTA button -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; mso-padding-alt: 16px 32px;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${siteUrl}" style="height:52px;v-text-anchor:middle;width:200px;" arcsize="23%" fillcolor="#6366f1">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">🏠 Return to Homepage</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a href="${siteUrl}" style="display: inline-block; color: white; text-decoration: none; padding: 16px 32px; font-weight: 700; font-size: 16px; border-radius: 12px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; line-height: 1;" class="mobile-button ultra-mobile-button">
                            🏠 Return to Homepage
                          </a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Support section -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;" class="mobile-small-padding">
                          <h4 style="color: #22c55e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="mobile-font-size">
                            Questions? We're Here to Help!
                          </h4>
                          <p style="color: #cbd5e1; margin: 0 0 12px 0; font-size: 13px; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="ultra-mobile-font-size">
                            Our team is ready to assist with any questions about your early access membership.
                          </p>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                              <td style="background-color: #22c55e; border-radius: 6px; mso-padding-alt: 10px 20px;">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:hello@purrfectstays.org?subject=Welcome - Position ${waitlistPosition}" style="height:36px;v-text-anchor:middle;width:140px;" arcsize="17%" fillcolor="#22c55e">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;">Contact Support</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="mailto:hello@purrfectstays.org?subject=Welcome - Position ${waitlistPosition}" style="display: inline-block; color: white; text-decoration: none; padding: 10px 20px; font-weight: 600; font-size: 14px; border-radius: 6px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                  Contact Support
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
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      © 2025 Purrfect Stays. All rights reserved.
                    </p>
                    <p style="color: #475569; font-size: 11px; margin: 0 0 12px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      Early Access Member #${waitlistPosition} | Founder's Circle
                    </p>
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      You received this email because you completed the Purrfect Stays waitlist signup.<br>
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