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
  
  // Use table-based layout with inline styles matching landing page design
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Purrfect Stays!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #312e81 100%); color: #e2e8f0; min-height: 100vh;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #312e81 100%); padding: 20px 0; min-height: 100vh;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: rgba(39, 39, 42, 0.8); backdrop-filter: blur(8px); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Gradient Background -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center; position: relative;">
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
                    <h1 style="color: white; margin: 0 0 16px 0; font-size: 32px; font-weight: 800; line-height: 1.2; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Welcome to Purrfect Stays!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0 0 24px 0; font-weight: 500; line-height: 1.4;">You're officially part of our early access community</p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="width: 120px; height: 120px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-radius: 60px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); position: relative;">
                      <span style="color: #10b981; font-size: 32px; font-weight: 800; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">#${waitlistPosition}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                
                <!-- Celebration Message -->
                <tr>
                  <td style="padding-bottom: 32px; text-align: center;">
                    <h2 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 28px; font-weight: 800;">Congratulations, ${name}! 🎉</h2>
                    <p style="color: #cbd5e1; font-size: 18px; margin: 0 0 24px 0; line-height: 1.6;">
                      You've secured position <span style="color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 6px;">#${waitlistPosition}</span> in our exclusive early access program.
                    </p>
                    <div style="background: linear-gradient(135deg, ${userTypeColor} 0%, ${userTypeColor}dd 100%); color: white; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
                      ${userTypeEmoji} ${userTypeLabel}
                    </div>
                  </td>
                </tr>
                
                <!-- Benefits Section -->
                <tr>
                  <td style="padding-bottom: 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; backdrop-filter: blur(4px);">
                      <tr>
                        <td style="padding: 32px;">
                          <h3 style="color: #a5b4fc; margin: 0 0 32px 0; font-size: 24px; font-weight: 700; text-align: center;">Your Exclusive Benefits</h3>
                          
                          <!-- Benefit 1 -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                            <tr>
                              <td style="width: 56px; vertical-align: top; padding-right: 20px;">
                                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                                  <span style="color: white; font-size: 24px;">💎</span>
                                </div>
                              </td>
                              <td style="vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Lifetime Benefits</h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6;">
                                  Lock in permanent perks and founder recognition that will never be offered again after our public launch.
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Benefit 2 -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                            <tr>
                              <td style="width: 56px; vertical-align: top; padding-right: 20px;">
                                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                                  <span style="color: white; font-size: 24px;">🎯</span>
                                </div>
                              </td>
                              <td style="vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Shape the Platform</h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6;">
                                  Your feedback directly influences our development roadmap. You're not just a user – you're a co-creator.
                                </p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Benefit 3 -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 56px; vertical-align: top; padding-right: 20px;">
                                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                                  <span style="color: white; font-size: 24px;">⚡</span>
                                </div>
                              </td>
                              <td style="vertical-align: top;">
                                <h4 style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Beta Access</h4>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6;">
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
                
                <!-- Timeline Section -->
                <tr>
                  <td style="padding-bottom: 40px;">
                    <h3 style="color: #a5b4fc; margin: 0 0 24px 0; font-size: 20px; font-weight: 700; text-align: center;">Your Journey Ahead</h3>
                    
                    <!-- Timeline Item 1 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 16px; font-weight: bold;">✓</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; border-bottom: 1px solid rgba(99, 102, 241, 0.2); padding-bottom: 16px;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Now: Welcome to the Community</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">You're officially in! Start sharing to help us build the ultimate cat community.</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Timeline Item 2 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 16px; font-weight: bold;">2</span>
                          </div>
                        </td>
                        <td style="vertical-align: top; border-bottom: 1px solid rgba(99, 102, 241, 0.2); padding-bottom: 16px;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Q4 2025: Beta Testing</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">First access to our platform. Test features and help us perfect the experience.</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Timeline Item 3 -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 48px; vertical-align: top; padding-right: 16px;">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-size: 16px; font-weight: bold;">🚀</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <h4 style="color: #e2e8f0; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Q1 2026: Full Launch</h4>
                          <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.4;">Public launch with your lifetime benefits activated and founder status recognized.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Share Section -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);">
                      <tr>
                        <td style="padding: 32px; text-align: center;">
                          <h3 style="color: white; margin: 0 0 16px 0; font-size: 22px; font-weight: 800;">Share with Fellow Cat Lovers</h3>
                          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0 0 24px 0; line-height: 1.5;">
                            Help us build the ultimate platform for the cat community by inviting others!
                          </p>
                          
                          <div style="background: rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 16px; margin: 20px 0; word-break: break-all; color: white; font-family: monospace; font-size: 14px;">
                            ${siteUrl}?ref=${waitlistPosition}
                          </div>
                          
                          <!-- Share Buttons -->
                          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                              <td style="padding: 0 8px;">
                                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just secured spot #${waitlistPosition} on the Purrfect Stays early access waitlist! 🐱 Revolutionary cattery booking platform launching in 2026.`)}&url=${encodeURIComponent(siteUrl + '?ref=' + waitlistPosition)}" style="background: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
                                  🐦 Twitter
                                </a>
                              </td>
                              <td style="padding: 0 8px;">
                                <a href="mailto:?subject=${encodeURIComponent('Check out Purrfect Stays!')}&body=${encodeURIComponent(`I just joined the Purrfect Stays early access waitlist and I'm #${waitlistPosition}! This revolutionary cattery booking platform launching in 2026 is exactly what the cat community needs. Join me: ${siteUrl}?ref=${waitlistPosition}`)}" style="background: rgba(255, 255, 255, 0.2); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
                                  📧 Email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                          <a href="${siteUrl}" style="display: block; color: white; text-decoration: none; padding: 16px 32px; font-weight: 700; font-size: 16px; border-radius: 12px;">
                            🏠 Return to Homepage
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Support Section -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px; text-align: center;">
                          <h4 style="color: #22c55e; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Questions? We're Here to Help!</h4>
                          <p style="color: #cbd5e1; margin: 0 0 16px 0; font-size: 14px; line-height: 1.4;">
                            Our team is ready to assist with any questions about your early access membership.
                          </p>
                          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                              <td style="background: #22c55e; border-radius: 8px;">
                                <a href="mailto:hello@purrfectstays.org?subject=Welcome - Position ${waitlistPosition}" style="display: block; background: #22c55e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
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
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">© 2025 Purrfect Stays. All rights reserved.</p>
                    <p style="color: #475569; font-size: 13px; margin: 0 0 16px 0;">
                      Early Access Member #${waitlistPosition} | Founder's Circle
                    </p>
                    <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.4;">
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