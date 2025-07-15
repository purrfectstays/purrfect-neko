# Temporary Dummy User System

## Current Status
The application is currently using a dummy user system to bypass database issues. This allows the complete user flow to work without RLS policy violations.

## How It Works
1. User registers with CAPTCHA verification
2. System creates a dummy user with proper UUID format (no database save)
3. Quiz submission detects dummy users and bypasses database calls
4. Success page shows with random waitlist position (1-50)

## To Enable Real Database Operations

### Option 1: Deploy Edge Function (Recommended)
```bash
# Deploy the edge function with service role permissions
supabase functions deploy send-verification-email

# Set the service role key in Supabase dashboard
# Settings → Edge Functions → send-verification-email → Environment Variables
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Option 2: Disable RLS Temporarily
```sql
-- WARNING: Only for testing
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses DISABLE ROW LEVEL SECURITY;
```

### Option 3: Configure Proper RLS Policies
```sql
-- Allow users to insert their own records
CREATE POLICY "Users can insert their own records" ON waitlist_users
FOR INSERT WITH CHECK (true);

-- Allow users to read their own records
CREATE POLICY "Users can read their own records" ON waitlist_users
FOR SELECT USING (auth.uid()::text = id OR is_verified = true);

-- Allow verified users to submit quiz responses
CREATE POLICY "Verified users can submit quiz" ON quiz_responses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM waitlist_users 
    WHERE waitlist_users.id = quiz_responses.user_id 
    AND waitlist_users.is_verified = true
  )
);
```

## Reverting Dummy User System
Once database is properly configured:
1. Remove the `isDummyUser` check in `QualificationQuizSecure.tsx`
2. Update `TemplatePreview.tsx` to use real registration flow
3. Test with real database operations

## Identifying Dummy Users
- Verification token: 'dummy-token'
- No database record exists
- Random waitlist position (1-50)