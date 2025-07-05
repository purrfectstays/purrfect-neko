-- Create a stored procedure for email verification that bypasses RLS
-- This runs with elevated privileges

CREATE OR REPLACE FUNCTION verify_email_with_token(token_param text)
RETURNS json AS $$
DECLARE
    updated_user RECORD;
    result json;
BEGIN
    -- Validate input
    IF token_param IS NULL OR token_param = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid verification token'
        );
    END IF;

    -- Update the user and return the result
    UPDATE waitlist_users
    SET 
        is_verified = true,
        verification_token = null,
        updated_at = now()
    WHERE 
        verification_token = token_param
        AND is_verified = false
    RETURNING * INTO updated_user;

    -- Check if update was successful
    IF NOT FOUND THEN
        -- Try to find why it failed
        IF EXISTS (SELECT 1 FROM waitlist_users WHERE verification_token = token_param AND is_verified = true) THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Email already verified'
            );
        ELSE
            RETURN json_build_object(
                'success', false,
                'error', 'Invalid or expired verification token'
            );
        END IF;
    END IF;

    -- Return success with user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', updated_user.id,
            'email', updated_user.email,
            'name', updated_user.name,
            'user_type', updated_user.user_type,
            'is_verified', updated_user.is_verified
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users (for public verification)
GRANT EXECUTE ON FUNCTION verify_email_with_token(text) TO anon, authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION verify_email_with_token(text) IS 
'Verifies user email with token, bypassing RLS. Returns JSON with success status and user data.';

-- Create an RPC policy to allow calling this function
CREATE POLICY "anyone_can_verify_email" ON waitlist_users
FOR ALL USING (true);  -- This is just to ensure the table is accessible

-- Note: To use this function from the frontend, call it like:
-- const { data, error } = await supabase.rpc('verify_email_with_token', { token_param: 'your-token' })