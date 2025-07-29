# Purrfect Stays - Email Verification System

## Current System Architecture

**IMPORTANT**: Purrfect Stays uses **INSTANT 6-DIGIT CODE VERIFICATION** - NO email sending required for verification!

### Verification Flow
1. **User registers** → System generates 6-digit code
2. **User enters code immediately** → No email verification step
3. **Code validated instantly** → User proceeds to quiz
4. **Quiz completion** → Welcome email sent via `send-welcome-email` Edge Function

### Edge Functions Used
- ✅ **`send-welcome-email`** - Sends welcome email AFTER quiz completion
- ✅ **`auto-send-welcome-emails`** - Batch processing for welcome emails
- ❌ **`send-verification-email`** - **NOT USED** - Legacy function, do not deploy

### Service Files
- **`unifiedEmailVerificationService.ts`** - Handles instant 6-digit verification (no email sending)
- **`emailVerificationService.ts`** - Deprecated legacy service

### Key Points
- **No email verification during registration** - users get instant access with 6-digit codes
- **Welcome emails only sent after quiz completion**
- **Faster user experience** - no waiting for email delivery
- **Higher conversion rates** - removes email verification friction

### Deployment Notes
When deploying Edge Functions:
- Deploy: `send-welcome-email`
- Deploy: `auto-send-welcome-emails` 
- Skip: `send-verification-email` (not used in current flow)