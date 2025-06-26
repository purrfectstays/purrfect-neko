-- Migration: Add regional tracking for geolocation-based urgency
-- Date: 2025-06-26

-- Add location columns to waitlist_users table
ALTER TABLE waitlist_users 
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(3),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50),
ADD COLUMN IF NOT EXISTS regional_position INTEGER;

-- Create regional_limits table to manage early access spots per region
CREATE TABLE IF NOT EXISTS regional_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    total_spots INTEGER NOT NULL DEFAULT 50,
    remaining_spots INTEGER NOT NULL DEFAULT 50,
    current_registrations INTEGER NOT NULL DEFAULT 0,
    urgency_level VARCHAR(10) NOT NULL DEFAULT 'low' CHECK (urgency_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(country_code)
);

-- Insert initial regional limits
INSERT INTO regional_limits (country, country_code, total_spots, remaining_spots, current_registrations, urgency_level) 
VALUES 
    ('New Zealand', 'NZ', 50, 8, 42, 'high'),
    ('Australia', 'AU', 150, 22, 128, 'medium'),
    ('United States', 'US', 200, 33, 167, 'medium'),
    ('United Kingdom', 'GB', 100, 11, 89, 'high'),
    ('Canada', 'CA', 80, 17, 63, 'medium'),
    ('Singapore', 'SG', 30, 4, 26, 'high'),
    ('Other', 'XX', 50, 19, 31, 'medium')
ON CONFLICT (country_code) DO NOTHING;

-- Create function to update regional position when user is added
CREATE OR REPLACE FUNCTION update_regional_position()
RETURNS TRIGGER AS $$
BEGIN
    -- Update regional position based on country
    IF NEW.country IS NOT NULL THEN
        -- Get current position in the country
        SELECT COALESCE(MAX(regional_position), 0) + 1
        INTO NEW.regional_position
        FROM waitlist_users 
        WHERE country = NEW.country 
        AND email_verified = true;
        
        -- Update regional limits
        UPDATE regional_limits 
        SET 
            current_registrations = current_registrations + 1,
            remaining_spots = total_spots - (current_registrations + 1),
            urgency_level = CASE 
                WHEN (current_registrations + 1)::FLOAT / total_spots >= 0.85 THEN 'high'
                WHEN (current_registrations + 1)::FLOAT / total_spots >= 0.60 THEN 'medium'
                ELSE 'low'
            END,
            updated_at = NOW()
        WHERE country_code = NEW.country_code OR (NEW.country_code NOT IN ('NZ', 'AU', 'US', 'GB', 'CA', 'SG') AND country_code = 'XX');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update regional position
DROP TRIGGER IF EXISTS update_regional_position_trigger ON waitlist_users;
CREATE TRIGGER update_regional_position_trigger
    BEFORE INSERT OR UPDATE ON waitlist_users
    FOR EACH ROW
    EXECUTE FUNCTION update_regional_position();

-- Create index for better performance on regional queries
CREATE INDEX IF NOT EXISTS idx_waitlist_users_country ON waitlist_users(country);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_country_code ON waitlist_users(country_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_regional_position ON waitlist_users(regional_position);

-- Create function to get regional waitlist data
CREATE OR REPLACE FUNCTION get_regional_waitlist_data(input_country_code VARCHAR(3))
RETURNS TABLE (
    country VARCHAR(100),
    region_name VARCHAR(100),
    total_spots INTEGER,
    remaining_spots INTEGER,
    current_position INTEGER,
    urgency_level VARCHAR(10)
) AS $$
BEGIN
    -- Get data for the specific country or 'Other' if not found
    RETURN QUERY
    SELECT 
        rl.country,
        rl.country as region_name,
        rl.total_spots,
        rl.remaining_spots,
        COALESCE(rl.current_registrations, 0) + 1 as current_position,
        rl.urgency_level
    FROM regional_limits rl
    WHERE rl.country_code = input_country_code
       OR (input_country_code NOT IN ('NZ', 'AU', 'US', 'GB', 'CA', 'SG') AND rl.country_code = 'XX')
    ORDER BY 
        CASE WHEN rl.country_code = input_country_code THEN 1 ELSE 2 END
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for regional_limits table
ALTER TABLE regional_limits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to regional limits for urgency display
CREATE POLICY "Allow public read access to regional limits" ON regional_limits
    FOR SELECT USING (true);

-- Only allow authenticated users to update (for admin purposes)
CREATE POLICY "Allow authenticated updates to regional limits" ON regional_limits
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Update existing users with default regional data if needed
UPDATE waitlist_users 
SET 
    country = 'Unknown',
    country_code = 'XX'
WHERE country IS NULL;