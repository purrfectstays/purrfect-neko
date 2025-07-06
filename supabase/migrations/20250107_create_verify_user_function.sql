-- Create a function to verify user email that bypasses RLS
-- This function can only be called by the service role

CREATE OR REPLACE FUNCTION verify_user_email(user_id UUID, token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to run with the privileges of the definer
AS $$
DECLARE
    user_exists BOOLEAN := FALSE;
BEGIN
    -- Check if user exists with the given token and is not verified
    SELECT EXISTS(
        SELECT 1 FROM waitlist_users 
        WHERE id = user_id 
        AND verification_token = token 
        AND is_verified = FALSE
    ) INTO user_exists;
    
    -- If user exists and is not verified, update them
    IF user_exists THEN
        UPDATE waitlist_users 
        SET 
            is_verified = TRUE,
            verification_token = NULL,
            updated_at = NOW()
        WHERE id = user_id AND verification_token = token;
        
        RETURN TRUE;
    END IF;
    
    -- Check if user is already verified with this token
    SELECT EXISTS(
        SELECT 1 FROM waitlist_users 
        WHERE id = user_id 
        AND (verification_token = token OR verification_token IS NULL)
        AND is_verified = TRUE
    ) INTO user_exists;
    
    -- Return true if already verified (no error)
    RETURN user_exists;
END;
$$;

-- Grant execute permission to authenticated users (service role)
GRANT EXECUTE ON FUNCTION verify_user_email(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_email(UUID, TEXT) TO service_role;

-- Add a comment for documentation
COMMENT ON FUNCTION verify_user_email(UUID, TEXT) IS 'Verifies a user email by updating their verification status. Bypasses RLS for Edge Function use.';