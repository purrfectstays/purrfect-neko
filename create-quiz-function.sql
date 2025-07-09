-- Create the quiz submission function manually
-- This should be run in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION submit_quiz_responses(
    p_user_id UUID,
    p_responses JSONB
)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
    response_item JSONB;
    quiz_response_id UUID;
    result JSON;
BEGIN
    -- Log function call
    RAISE NOTICE 'submit_quiz_responses called for user: %', p_user_id;
    
    -- Validate input
    IF p_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User ID is required'
        );
    END IF;
    
    IF p_responses IS NULL OR jsonb_array_length(p_responses) = 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Quiz responses are required'
        );
    END IF;
    
    -- Get user and verify they exist and are verified
    SELECT * INTO user_record
    FROM waitlist_users
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    IF NOT user_record.is_verified THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User must be verified before submitting quiz responses'
        );
    END IF;
    
    IF user_record.quiz_completed THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Quiz already completed'
        );
    END IF;
    
    -- Insert quiz responses
    FOR response_item IN SELECT * FROM jsonb_array_elements(p_responses)
    LOOP
        INSERT INTO quiz_responses (user_id, question_id, answer)
        VALUES (
            p_user_id,
            response_item->>'question_id',
            response_item->>'answer'
        );
    END LOOP;
    
    -- Mark quiz as completed and get updated user data
    UPDATE waitlist_users
    SET 
        quiz_completed = true,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING * INTO user_record;
    
    -- Return success with user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'name', user_record.name,
            'email', user_record.email,
            'user_type', user_record.user_type,
            'is_verified', user_record.is_verified,
            'quiz_completed', user_record.quiz_completed,
            'waitlist_position', user_record.waitlist_position
        ),
        'waitlist_position', COALESCE(user_record.waitlist_position, 0)
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in submit_quiz_responses: %', SQLERRM;
        RETURN json_build_object(
            'success', false,
            'error', 'Failed to submit quiz responses: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION submit_quiz_responses(UUID, JSONB) TO anon, authenticated, service_role;

-- Add helpful comment
COMMENT ON FUNCTION submit_quiz_responses(UUID, JSONB) IS 'Securely submit quiz responses and mark quiz as completed for verified users';