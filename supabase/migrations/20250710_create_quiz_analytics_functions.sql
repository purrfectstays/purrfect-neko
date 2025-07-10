-- Quiz Analytics Functions and Views
-- Date: 2025-07-10
-- Purpose: Create comprehensive analytics functions for quiz data analysis

-- =================================================================
-- PHASE 1: CREATE ANALYTICS HELPER FUNCTIONS
-- =================================================================

-- Function to extract pricing tier from quiz responses
CREATE OR REPLACE FUNCTION extract_pricing_tier(pricing_answer TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN pricing_answer ILIKE '%truffle%' THEN RETURN 'truffle';
        WHEN pricing_answer ILIKE '%pepper%' THEN RETURN 'pepper';
        WHEN pricing_answer ILIKE '%chicken%' THEN RETURN 'chicken';
        WHEN pricing_answer ILIKE '%free%' THEN RETURN 'free';
        WHEN pricing_answer ILIKE '%pay-per%' THEN RETURN 'pay-per-use';
        ELSE RETURN 'other';
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract budget range from quiz responses
CREATE OR REPLACE FUNCTION extract_budget_range(budget_answer TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN budget_answer ILIKE '%under%50%' OR budget_answer ILIKE '%under%$50%' THEN RETURN 'under-50';
        WHEN budget_answer ILIKE '%50%100%' OR budget_answer ILIKE '%$50%$100%' THEN RETURN '50-100';
        WHEN budget_answer ILIKE '%100%200%' OR budget_answer ILIKE '%$100%$200%' THEN RETURN '100-200';
        WHEN budget_answer ILIKE '%200%300%' OR budget_answer ILIKE '%$200%$300%' THEN RETURN '200-300';
        WHEN budget_answer ILIKE '%over%300%' OR budget_answer ILIKE '%over%$300%' THEN RETURN 'over-300';
        WHEN budget_answer ILIKE '%nothing%' THEN RETURN 'nothing';
        WHEN budget_answer ILIKE '%under%150%' THEN RETURN 'under-150';
        WHEN budget_answer ILIKE '%150%300%' THEN RETURN '150-300';
        ELSE RETURN 'other';
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract pain points from quiz responses
CREATE OR REPLACE FUNCTION extract_pain_point(challenge_answer TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN challenge_answer ILIKE '%availability%' THEN RETURN 'finding-availability';
        WHEN challenge_answer ILIKE '%price%' OR challenge_answer ILIKE '%cost%' THEN RETURN 'pricing-comparison';
        WHEN challenge_answer ILIKE '%review%' THEN RETURN 'reading-reviews';
        WHEN challenge_answer ILIKE '%booking%' OR challenge_answer ILIKE '%process%' THEN RETURN 'booking-complexity';
        WHEN challenge_answer ILIKE '%communication%' THEN RETURN 'communication';
        WHEN challenge_answer ILIKE '%customer%' THEN RETURN 'finding-customers';
        WHEN challenge_answer ILIKE '%management%' OR challenge_answer ILIKE '%managing%' THEN RETURN 'booking-management';
        WHEN challenge_answer ILIKE '%payment%' THEN RETURN 'payment-processing';
        WHEN challenge_answer ILIKE '%marketing%' THEN RETURN 'marketing';
        WHEN challenge_answer ILIKE '%seasonal%' THEN RETURN 'seasonal-fluctuations';
        ELSE RETURN 'other';
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =================================================================
-- PHASE 2: CREATE ANALYTICS VIEWS
-- =================================================================

-- Comprehensive quiz responses view with user data
CREATE OR REPLACE VIEW quiz_responses_with_users AS
SELECT 
    qr.id as response_id,
    qr.user_id,
    qr.question_id,
    qr.answer,
    qr.created_at as response_date,
    wu.name,
    wu.email,
    wu.user_type,
    wu.country,
    wu.region,
    wu.city,
    wu.country_code,
    wu.waitlist_position,
    wu.created_at as signup_date,
    CASE 
        WHEN qr.question_id = 'pricing-tier-preference' THEN extract_pricing_tier(qr.answer)
        ELSE NULL 
    END as pricing_tier,
    CASE 
        WHEN qr.question_id = 'budget' THEN extract_budget_range(qr.answer)
        WHEN qr.question_id = 'marketing-spend' THEN extract_budget_range(qr.answer)
        ELSE NULL 
    END as budget_range,
    CASE 
        WHEN qr.question_id IN ('challenge', 'main-challenge') THEN extract_pain_point(qr.answer)
        ELSE NULL 
    END as pain_point
FROM quiz_responses qr
JOIN waitlist_users wu ON qr.user_id = wu.id
WHERE wu.quiz_completed = true;

-- =================================================================
-- PHASE 3: CREATE ANALYTICS FUNCTIONS
-- =================================================================

-- Get pricing analytics data
CREATE OR REPLACE FUNCTION get_pricing_analytics()
RETURNS TABLE (
    user_type user_type,
    pricing_tier TEXT,
    country TEXT,
    country_code TEXT,
    response_count BIGINT,
    percentage DECIMAL,
    currency TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH pricing_data AS (
        SELECT 
            qrwu.user_type,
            qrwu.pricing_tier,
            COALESCE(qrwu.country, 'Unknown') as country,
            COALESCE(qrwu.country_code, 'XX') as country_code,
            COUNT(*) as response_count
        FROM quiz_responses_with_users qrwu
        WHERE qrwu.pricing_tier IS NOT NULL
        GROUP BY qrwu.user_type, qrwu.pricing_tier, qrwu.country, qrwu.country_code
    ),
    total_responses AS (
        SELECT user_type, COUNT(*) as total
        FROM quiz_responses_with_users
        WHERE pricing_tier IS NOT NULL
        GROUP BY user_type
    )
    SELECT 
        pd.user_type,
        pd.pricing_tier,
        pd.country,
        pd.country_code,
        pd.response_count,
        ROUND((pd.response_count::DECIMAL / tr.total * 100), 2) as percentage,
        CASE 
            WHEN pd.country_code = 'NZ' THEN 'NZD'
            WHEN pd.country_code = 'AU' THEN 'AUD'
            WHEN pd.country_code = 'GB' THEN 'GBP'
            WHEN pd.country_code = 'CA' THEN 'CAD'
            WHEN pd.country_code = 'SG' THEN 'SGD'
            ELSE 'USD'
        END as currency
    FROM pricing_data pd
    JOIN total_responses tr ON pd.user_type = tr.user_type
    ORDER BY pd.user_type, pd.response_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get geographic analytics data
CREATE OR REPLACE FUNCTION get_geographic_analytics()
RETURNS TABLE (
    country TEXT,
    country_code TEXT,
    total_users BIGINT,
    cat_parents BIGINT,
    cattery_owners BIGINT,
    avg_willingness DECIMAL,
    top_tier TEXT,
    revenue_opportunity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH geographic_stats AS (
        SELECT 
            COALESCE(wu.country, 'Unknown') as country,
            COALESCE(wu.country_code, 'XX') as country_code,
            COUNT(*) as total_users,
            COUNT(*) FILTER (WHERE wu.user_type = 'cat-parent') as cat_parents,
            COUNT(*) FILTER (WHERE wu.user_type = 'cattery-owner') as cattery_owners
        FROM waitlist_users wu
        WHERE wu.quiz_completed = true
        GROUP BY wu.country, wu.country_code
    ),
    pricing_by_region AS (
        SELECT 
            COALESCE(qrwu.country, 'Unknown') as country,
            qrwu.pricing_tier,
            COUNT(*) as tier_count,
            ROW_NUMBER() OVER (PARTITION BY qrwu.country ORDER BY COUNT(*) DESC) as tier_rank
        FROM quiz_responses_with_users qrwu
        WHERE qrwu.pricing_tier IS NOT NULL
        GROUP BY qrwu.country, qrwu.pricing_tier
    ),
    revenue_calc AS (
        SELECT 
            gs.country,
            gs.country_code,
            gs.total_users,
            gs.cat_parents,
            gs.cattery_owners,
            -- Calculate average willingness based on tier distribution
            CASE 
                WHEN gs.cat_parents > 0 THEN 
                    (gs.cat_parents * 5.99) + (gs.cattery_owners * 34.33)
                ELSE gs.cattery_owners * 34.33
            END as revenue_opportunity
        FROM geographic_stats gs
    )
    SELECT 
        rc.country,
        rc.country_code,
        rc.total_users,
        rc.cat_parents,
        rc.cattery_owners,
        ROUND((rc.revenue_opportunity / NULLIF(rc.total_users, 0)), 2) as avg_willingness,
        COALESCE(
            (SELECT pbr.pricing_tier 
             FROM pricing_by_region pbr 
             WHERE pbr.country = rc.country AND pbr.tier_rank = 1), 
            'unknown'
        ) as top_tier,
        ROUND(rc.revenue_opportunity, 2) as revenue_opportunity
    FROM revenue_calc rc
    ORDER BY rc.revenue_opportunity DESC;
END;
$$ LANGUAGE plpgsql;

-- Get user segment analytics
CREATE OR REPLACE FUNCTION get_user_segment_analytics()
RETURNS TABLE (
    user_type user_type,
    segment_name TEXT,
    characteristics JSONB,
    user_count BIGINT,
    avg_score DECIMAL,
    revenue_potential DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH user_scoring AS (
        SELECT 
            wu.id,
            wu.user_type,
            wu.country,
            COUNT(qr.id) as response_count,
            -- Simple scoring based on premium tier selection and feature interest
            SUM(
                CASE 
                    WHEN qr.question_id = 'pricing-tier-preference' AND qr.answer ILIKE '%chicken%' THEN 10
                    WHEN qr.question_id = 'pricing-tier-preference' AND qr.answer ILIKE '%pepper%' THEN 7
                    WHEN qr.question_id = 'pricing-tier-preference' AND qr.answer ILIKE '%truffle%' THEN 5
                    WHEN qr.question_id = 'feature-interest' THEN qr.answer::INTEGER
                    WHEN qr.question_id = 'frequency' AND qr.answer ILIKE '%more than 8%' THEN 8
                    WHEN qr.question_id = 'frequency' AND qr.answer ILIKE '%5-8%' THEN 6
                    ELSE 0
                END
            ) as total_score
        FROM waitlist_users wu
        JOIN quiz_responses qr ON wu.id = qr.user_id
        WHERE wu.quiz_completed = true
        GROUP BY wu.id, wu.user_type, wu.country
    ),
    segments AS (
        SELECT 
            us.user_type,
            CASE 
                WHEN us.total_score >= 25 THEN 'High Value'
                WHEN us.total_score >= 15 THEN 'Growth Potential'
                WHEN us.total_score >= 8 THEN 'Standard User'
                ELSE 'Price Sensitive'
            END as segment_name,
            COUNT(*) as user_count,
            AVG(us.total_score) as avg_score
        FROM user_scoring us
        GROUP BY us.user_type, 
                 CASE 
                     WHEN us.total_score >= 25 THEN 'High Value'
                     WHEN us.total_score >= 15 THEN 'Growth Potential'
                     WHEN us.total_score >= 8 THEN 'Standard User'
                     ELSE 'Price Sensitive'
                 END
    )
    SELECT 
        s.user_type,
        s.segment_name,
        jsonb_build_object(
            'score_range', 
            CASE 
                WHEN s.segment_name = 'High Value' THEN '25+'
                WHEN s.segment_name = 'Growth Potential' THEN '15-24'
                WHEN s.segment_name = 'Standard User' THEN '8-14'
                ELSE '0-7'
            END,
            'typical_behavior', 
            CASE 
                WHEN s.segment_name = 'High Value' THEN 'Premium tier selection, high feature interest'
                WHEN s.segment_name = 'Growth Potential' THEN 'Mid-tier selection, moderate feature interest'
                WHEN s.segment_name = 'Standard User' THEN 'Basic tier preference, standard usage'
                ELSE 'Free tier focus, price sensitive'
            END
        ) as characteristics,
        s.user_count,
        ROUND(s.avg_score, 2) as avg_score,
        ROUND(
            s.user_count * 
            CASE 
                WHEN s.user_type = 'cat-parent' THEN
                    CASE 
                        WHEN s.segment_name = 'High Value' THEN 7.99
                        WHEN s.segment_name = 'Growth Potential' THEN 3.99
                        ELSE 0
                    END
                ELSE -- cattery-owner
                    CASE 
                        WHEN s.segment_name = 'High Value' THEN 59
                        WHEN s.segment_name = 'Growth Potential' THEN 29
                        WHEN s.segment_name = 'Standard User' THEN 15
                        ELSE 0
                    END
            END * 12, 2
        ) as revenue_potential
    FROM segments s
    ORDER BY s.user_type, s.avg_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Get budget distribution analysis
CREATE OR REPLACE FUNCTION get_budget_distribution()
RETURNS TABLE (
    user_type user_type,
    budget_range TEXT,
    count BIGINT,
    percentage DECIMAL,
    avg_budget DECIMAL,
    country TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH budget_data AS (
        SELECT 
            qrwu.user_type,
            qrwu.budget_range,
            COALESCE(qrwu.country, 'Unknown') as country,
            COUNT(*) as count,
            -- Estimate average budget from range
            CASE 
                WHEN qrwu.budget_range = 'under-50' THEN 25
                WHEN qrwu.budget_range = '50-100' THEN 75
                WHEN qrwu.budget_range = '100-200' THEN 150
                WHEN qrwu.budget_range = '200-300' THEN 250
                WHEN qrwu.budget_range = 'over-300' THEN 400
                WHEN qrwu.budget_range = 'nothing' THEN 0
                WHEN qrwu.budget_range = 'under-150' THEN 75
                WHEN qrwu.budget_range = '150-300' THEN 225
                ELSE 100
            END as avg_budget
        FROM quiz_responses_with_users qrwu
        WHERE qrwu.budget_range IS NOT NULL
        GROUP BY qrwu.user_type, qrwu.budget_range, qrwu.country
    ),
    total_by_type AS (
        SELECT 
            user_type,
            SUM(count) as total_count
        FROM budget_data
        GROUP BY user_type
    )
    SELECT 
        bd.user_type,
        bd.budget_range,
        bd.count,
        ROUND((bd.count::DECIMAL / tbt.total_count * 100), 2) as percentage,
        bd.avg_budget,
        bd.country
    FROM budget_data bd
    JOIN total_by_type tbt ON bd.user_type = tbt.user_type
    ORDER BY bd.user_type, bd.count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get pain point analysis
CREATE OR REPLACE FUNCTION get_pain_point_analysis()
RETURNS TABLE (
    pain_point TEXT,
    user_type user_type,
    frequency BIGINT,
    percentage DECIMAL,
    severity TEXT,
    country TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH pain_data AS (
        SELECT 
            qrwu.pain_point,
            qrwu.user_type,
            COALESCE(qrwu.country, 'Unknown') as country,
            COUNT(*) as frequency
        FROM quiz_responses_with_users qrwu
        WHERE qrwu.pain_point IS NOT NULL
        GROUP BY qrwu.pain_point, qrwu.user_type, qrwu.country
    ),
    total_by_type AS (
        SELECT 
            user_type,
            SUM(frequency) as total_responses
        FROM pain_data
        GROUP BY user_type
    )
    SELECT 
        pd.pain_point,
        pd.user_type,
        pd.frequency,
        ROUND((pd.frequency::DECIMAL / tbt.total_responses * 100), 2) as percentage,
        CASE 
            WHEN pd.frequency::DECIMAL / tbt.total_responses > 0.3 THEN 'critical'
            WHEN pd.frequency::DECIMAL / tbt.total_responses > 0.2 THEN 'high'
            WHEN pd.frequency::DECIMAL / tbt.total_responses > 0.1 THEN 'medium'
            ELSE 'low'
        END as severity,
        pd.country
    FROM pain_data pd
    JOIN total_by_type tbt ON pd.user_type = tbt.user_type
    ORDER BY pd.user_type, pd.frequency DESC;
END;
$$ LANGUAGE plpgsql;

-- Get conversion funnel analysis
CREATE OR REPLACE FUNCTION get_conversion_funnel()
RETURNS TABLE (
    step_name TEXT,
    user_count BIGINT,
    conversion_rate DECIMAL,
    drop_off_reasons TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH funnel_steps AS (
        SELECT 'Registration' as step, COUNT(*) as users FROM waitlist_users
        UNION ALL
        SELECT 'Email Verification' as step, COUNT(*) as users FROM waitlist_users WHERE is_verified = true
        UNION ALL
        SELECT 'Quiz Started' as step, COUNT(DISTINCT user_id) as users FROM quiz_responses
        UNION ALL
        SELECT 'Quiz Completed' as step, COUNT(*) as users FROM waitlist_users WHERE quiz_completed = true
    ),
    conversion_calc AS (
        SELECT 
            fs.step as step_name,
            fs.users as user_count,
            LAG(fs.users) OVER (ORDER BY 
                CASE fs.step 
                    WHEN 'Registration' THEN 1
                    WHEN 'Email Verification' THEN 2
                    WHEN 'Quiz Started' THEN 3
                    WHEN 'Quiz Completed' THEN 4
                END
            ) as prev_users
        FROM funnel_steps fs
    )
    SELECT 
        cc.step_name,
        cc.user_count,
        CASE 
            WHEN cc.prev_users > 0 THEN ROUND((cc.user_count::DECIMAL / cc.prev_users * 100), 2)
            ELSE 100.0
        END as conversion_rate,
        ARRAY[]::TEXT[] as drop_off_reasons  -- Placeholder for detailed analysis
    FROM conversion_calc cc
    ORDER BY 
        CASE cc.step_name 
            WHEN 'Registration' THEN 1
            WHEN 'Email Verification' THEN 2
            WHEN 'Quiz Started' THEN 3
            WHEN 'Quiz Completed' THEN 4
        END;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- PHASE 4: GRANT PERMISSIONS
-- =================================================================

-- Grant execute permissions to all roles
GRANT EXECUTE ON FUNCTION extract_pricing_tier(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION extract_budget_range(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION extract_pain_point(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_pricing_analytics() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_geographic_analytics() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_segment_analytics() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_budget_distribution() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_pain_point_analysis() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_conversion_funnel() TO anon, authenticated, service_role;

-- Grant select permissions on views
GRANT SELECT ON quiz_responses_with_users TO anon, authenticated, service_role;

-- =================================================================
-- PHASE 5: CREATE INDEXES FOR PERFORMANCE
-- =================================================================

-- Indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question_answer 
ON quiz_responses(question_id, answer);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_quiz_completed_country 
ON waitlist_users(quiz_completed, country) 
WHERE quiz_completed = true;

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_question 
ON quiz_responses(user_id, question_id);

-- =================================================================
-- PHASE 6: ADD HELPFUL COMMENTS
-- =================================================================

COMMENT ON FUNCTION get_pricing_analytics() IS 'Returns pricing preferences distribution by user type and region';
COMMENT ON FUNCTION get_geographic_analytics() IS 'Returns geographic distribution and revenue opportunities';
COMMENT ON FUNCTION get_user_segment_analytics() IS 'Returns user segmentation analysis with revenue potential';
COMMENT ON FUNCTION get_budget_distribution() IS 'Returns budget range distribution analysis';
COMMENT ON FUNCTION get_pain_point_analysis() IS 'Returns pain point frequency and severity analysis';
COMMENT ON FUNCTION get_conversion_funnel() IS 'Returns conversion funnel analysis';

COMMENT ON VIEW quiz_responses_with_users IS 'Comprehensive view combining quiz responses with user data for analytics';

-- =================================================================
-- PHASE 7: LOG COMPLETION
-- =================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Quiz analytics functions created successfully';
    RAISE NOTICE '📊 Analytics views: 1 created';
    RAISE NOTICE '⚡ Analytics functions: 9 created';
    RAISE NOTICE '🔍 Helper functions: 3 created';
    RAISE NOTICE '📈 Indexes: 3 performance indexes added';
    RAISE NOTICE '🚀 Ready for business intelligence dashboards';
END $$;