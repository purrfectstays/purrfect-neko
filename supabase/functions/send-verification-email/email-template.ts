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
  
  // Use table-based layout with inline styles only (matching landing page design)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Purrfect Stays</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #312e81 100%); color: #e2e8f0; min-height: 100vh;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #312e81 100%); padding: 20px 0; min-height: 100vh;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(39, 39, 42, 0.8); backdrop-filter: blur(8px); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Gradient Background -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 48px 32px; text-align: center; position: relative;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border-radius: 20px; padding: 16px; display: inline-block; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
                      <img src="${logoSrc}" alt="Purrfect Stays" width="48" height="48" style="display: block; margin: 0 auto; border-radius: 8px;">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: white; margin: 0 0 16px 0; font-size: 32px; font-weight: 800; line-height: 1.2; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Verify Your Email</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0; font-weight: 500; line-height: 1.4;">You're one step away from early access</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                
                <!-- Personal Greeting -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <h2 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Hi ${name}! 👋</h2>
                    <p style="color: #cbd5e1; font-size: 16px; margin: 0; line-height: 1.6;">
                      Welcome to the <span style="color: #a5b4fc; font-weight: 600;">Purrfect Stays</span> early access community! 
                      We're thrilled to have you join us as we revolutionize cattery bookings.
                    </p>
                  </td>
                </tr>
                
                <!-- User Type Badge -->
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <div style="background: linear-gradient(135deg, ${userTypeColor} 0%, ${userTypeColor}dd 100%); color: white; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
                      ${userTypeEmoji} ${userTypeLabel}
                    </div>
                  </td>
                </tr>
                
                <!-- Verification CTA Box -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; backdrop-filter: blur(4px);">
                      <tr>
                        <td style="padding: 32px; text-align: center;">
                          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);">
                            <span style="color: white; font-size: 32px; line-height: 1;">✉️</span>
                          </div>
                          <h3 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 22px; font-weight: 700;">Confirm Your Email Address</h3>
                          <p style="color: #94a3b8; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
                            Click the button below to verify your email and access your personalized onboarding quiz
                          </p>
                          
                          <!-- CTA Button -->
                          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                              <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                                <a href="${verificationUrl}" style="display: block; color: white; text-decoration: none; padding: 16px 32px; font-weight: 700; font-size: 16px; border-radius: 12px; transition: all 0.3s ease;">
                                  ✨ Verify My Email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Benefits Preview -->
                <tr>
                  <td style="padding-top: 40px;">
                    <h3 style="color: #a5b4fc; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; text-align: center;">What Awaits You:</h3>
                    
                    <!-- Benefit Items -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 20px;">🎯</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-bottom: 16px;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Shape the Platform</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Your feedback directly influences our development roadmap</p>
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 20px;">⚡</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; padding-bottom: 16px;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Beta Access</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Be the first to try new features before public launch</p>
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 20px;">💎</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Lifetime Benefits</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Exclusive perks that will never be offered again after launch</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Urgency Section -->
                <tr>
                  <td style="padding-top: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="color: white; font-size: 15px; margin: 0; font-weight: 600; line-height: 1.4;">
                            ⏰ <strong>Limited Time:</strong> Early access spots are filling up fast. Verify now to secure your position!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Alternative Link -->
                <tr>
                  <td style="padding-top: 32px; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">Having trouble with the button?</p>
                    <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.4;">
                      Copy and paste this link: <br>
                      <a href="${verificationUrl}" style="color: #6366f1; text-decoration: none; word-break: break-all;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: rgba(15, 23, 42, 0.8); padding: 32px; text-align: center; border-top: 1px solid rgba(99, 102, 241, 0.2);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 8px; display: inline-block;">
                      <img src="${logoSrc}" alt="Purrfect Stays" width="24" height="24" style="display: block; margin: 0 auto;">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">© 2025 Purrfect Stays. All rights reserved.</p>
                    <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.4;">
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