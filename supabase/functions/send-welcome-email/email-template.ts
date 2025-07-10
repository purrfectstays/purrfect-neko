export function getWelcomeEmailTemplate(
  name: string, 
  waitlistPosition: number, 
  userType: string, 
  siteUrl: string, 
  email: string,
  logoDataUrl: string | null
): string {
  const userTypeLabel = userType === 'cat-parent' ? 'Cat Parent' : 'Cattery Owner';
  const userTypeColor = userType === 'cat-parent' ? '#22c55e' : '#8b5cf6';
  const userTypeEmoji = userType === 'cat-parent' ? '🐱' : '🏠';
  
  // Always use production site for logo assets
  const logoBaseSite = 'https://purrfectstays.org';
  const logoSrc = logoDataUrl || `${logoBaseSite}/logo-email.png`;
  
  // Use table-based layout with inline styles only (no style tags)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Purrfect Stays!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #22c55e; padding: 40px 20px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background-color: white; border-radius: 16px; padding: 12px; display: inline-block;">
                      <img src="${logoSrc}" alt="Purrfect Stays" width="56" height="56" style="display: block;">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: white; margin: 0 0 12px 0; font-size: 28px; font-weight: bold;">Welcome to Purrfect Stays!</h1>
                    <p style="color: white; font-size: 18px; margin: 0 0 20px 0;">You're officially part of our early access community</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="background-color: white; color: #22c55e; font-size: 32px; font-weight: bold; width: 120px; height: 120px; line-height: 120px; border-radius: 60px; margin: 0 auto; text-align: center;">
                      #${waitlistPosition}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px;">
              <!-- Celebration Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #22c55e; border-radius: 12px; padding: 32px 20px; text-align: center;">
                    <h2 style="color: white; margin: 0 0 16px 0; font-size: 28px;">Congratulations, ${name}! 🎉</h2>
                    <p style="color: white; font-size: 18px; margin: 0 0 20px 0;">
                      You've secured position <strong>#${waitlistPosition}</strong> in our exclusive early access program.
                    </p>
                    <span style="background-color: ${userTypeColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; display: inline-block;">
                      ${userTypeEmoji} ${userTypeLabel}
                    </span>
                  </td>
                </tr>
              </table>
              
              <!-- Benefits Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 32px;">
                    <h3 style="color: #a5b4fc; margin: 0 0 24px 0; font-size: 22px; text-align: center;">Your Exclusive Benefits</h3>
                    
                    <!-- Benefit 1 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 10px; text-align: center; line-height: 40px; font-weight: bold;">💎</div>
                              </td>
                              <td style="padding-left: 16px;">
                                <h4 style="color: #22c55e; margin: 0 0 8px 0; font-size: 18px;">Lifetime Benefits</h4>
                                <p style="color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.6;">
                                  Lock in permanent benefits and special recognition that will never be offered again after our public launch.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Benefit 2 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 10px; text-align: center; line-height: 40px; font-weight: bold;">🎯</div>
                              </td>
                              <td style="padding-left: 16px;">
                                <h4 style="color: #22c55e; margin: 0 0 8px 0; font-size: 18px;">Shape the Platform</h4>
                                <p style="color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.6;">
                                  Your feedback directly shapes our features and roadmap. You're not just a user – you're a co-creator.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Benefit 3 -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 10px; text-align: center; line-height: 40px; font-weight: bold;">⚡</div>
                              </td>
                              <td style="padding-left: 16px;">
                                <h4 style="color: #22c55e; margin: 0 0 8px 0; font-size: 18px;">Early Beta Access</h4>
                                <p style="color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.6;">
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
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${siteUrl}" style="background-color: #6366f1; color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
                      Return to Homepage
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px;">
                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #334155;">
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">
                      © 2025 Purrfect Stays. All rights reserved.
                    </p>
                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                      You received this email because you completed the Purrfect Stays waitlist signup.<br>
                      <a href="${siteUrl}/unsubscribe?email=${email}" style="color: #6366f1; text-decoration: none;">Unsubscribe</a> | 
                      <a href="${siteUrl}/privacy" style="color: #6366f1; text-decoration: none;">Privacy Policy</a>
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