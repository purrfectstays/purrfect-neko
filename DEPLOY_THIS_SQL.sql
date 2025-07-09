-- COMPREHENSIVE QUIZ SUBMISSION SOLUTION
-- Run this in Supabase Dashboard → SQL Editor

-- First, ensure the function exists with proper error handling
CREATE OR REPLACE FUNCTION submit_quiz_responses(
    p_user_id UUID,
    p_responses JSONB
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    response_item JSONB;
    result JSON;
BEGIN
    -- Validate inputs
    IF p_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User ID is required'
        );
    END IF;
    
    IF p_responses IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Quiz responses are required'
        );
    END IF;
    
    -- Get and validate user
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
            'error', 'User must be verified before submitting quiz'
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
            (response_item->>'question_id')::text,
            (response_item->>'answer')::text
        )
        ON CONFLICT (user_id, question_id) DO UPDATE 
        SET answer = EXCLUDED.answer;
    END LOOP;
    
    -- Mark quiz as completed and get updated user data
    UPDATE waitlist_users
    SET 
        quiz_completed = true,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING * INTO user_record;
    
    -- Return success with complete user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'name', user_record.name,
            'email', user_record.email,
            'user_type', user_record.user_type,
            'is_verified', user_record.is_verified,
            'quiz_completed', user_record.quiz_completed,
            'waitlist_position', COALESCE(user_record.waitlist_position, 0),
            'created_at', user_record.created_at,
            'updated_at', user_record.updated_at
        ),
        'waitlist_position', COALESCE(user_record.waitlist_position, 0)
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Database error: ' || SQLERRM
        );
END;
$$;

-- Grant proper permissions
GRANT EXECUTE ON FUNCTION submit_quiz_responses(UUID, JSONB) TO anon, authenticated, service_role;

-- Ensure RLS policies allow the function to work
-- Create a policy that allows quiz completion updates
DO $$
BEGIN
    -- Check if policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'waitlist_users' 
        AND policyname = 'Allow quiz completion updates'
    ) THEN
        CREATE POLICY "Allow quiz completion updates" ON waitlist_users
        FOR UPDATE 
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Ensure quiz_responses table has proper policies
DO $$
BEGIN
    -- Enable RLS on quiz_responses if not already enabled
    ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
    
    -- Create insert policy for quiz responses if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quiz_responses' 
        AND policyname = 'Allow quiz response inserts'
    ) THEN
        CREATE POLICY "Allow quiz response inserts" ON quiz_responses
        FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Verify function was created successfully
SELECT 'Function created successfully!' as status,
       proname as function_name,
       prosecdef as security_definer
FROM pg_proc 
WHERE proname = 'submit_quiz_responses';