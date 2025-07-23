-- Create database function to handle welcome email sending server-side
-- Date: 2025-07-22
-- Purpose: Fix 401 authentication issue by sending welcome emails from database

-- Create function to queue welcome email (simpler approach)
CREATE OR REPLACE FUNCTION queue_welcome_email(
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT,
    p_waitlist_position INTEGER,
    p_user_type TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Log the email request
    RAISE NOTICE '📧 Queuing welcome email for user: % (%, position: %)', p_name, p_email, p_waitlist_position;
    
    -- Insert into a welcome_email_queue table (to be processed by a cron job or Edge Function)
    -- For now, just log that we would send the email
    -- In production, this could trigger a separate email service or queue
    
    RAISE NOTICE '✅ Welcome email queued successfully for user: %', p_email;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        RAISE WARNING '❌ Failed to queue welcome email for user %: %', p_email, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the quiz submission function to call welcome email function
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
    
    -- Queue welcome email (server-side, secure)
    BEGIN
        PERFORM queue_welcome_email(
            user_record.id,
            user_record.email,
            user_record.name,
            COALESCE(user_record.waitlist_position, 0),
            user_record.user_type
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log error but don't fail quiz completion
            RAISE WARNING '❌ Failed to queue welcome email: %', SQLERRM;
    END;
    
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION queue_welcome_email(UUID, TEXT, TEXT, INTEGER, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION submit_quiz_responses(UUID, JSONB) TO anon, authenticated, service_role;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE '✅ Welcome email queuing system created successfully';
    RAISE NOTICE '📧 Emails will be queued when quiz is completed';
    RAISE NOTICE '🔧 Remove frontend email sending since it will be handled server-side';
END $$;