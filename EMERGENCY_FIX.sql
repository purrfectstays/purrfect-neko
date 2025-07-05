-- EMERGENCY FIX - Use this if nothing else works
-- This temporarily makes verification work by removing all restrictions

-- Step 1: Disable RLS completely (nuclear option)
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Test your verification now - it should work!

-- Step 3: After confirming it works, run this to add basic security back:
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- Create one ultra-simple policy that allows everything
CREATE POLICY "temp_allow_all" ON waitlist_users
FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Test again - if it still works, the issue was complex RLS policies

-- Step 5: Once working, gradually add proper policies back:
DROP POLICY "temp_allow_all" ON waitlist_users;

-- Add back proper policies one at a time, testing after each:

-- Policy 1: Allow reading
CREATE POLICY "allow_select" ON waitlist_users
FOR SELECT USING (true);

-- Test verification...

-- Policy 2: Allow verification updates
CREATE POLICY "allow_verification" ON waitlist_users
FOR UPDATE 
USING (verification_token IS NOT NULL)
WITH CHECK (is_verified = true);

-- Test verification...

-- If it breaks at any point, you've found the problematic policy!