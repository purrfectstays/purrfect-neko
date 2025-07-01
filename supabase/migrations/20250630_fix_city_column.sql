-- Emergency fix for missing city column
-- Date: 2025-06-30

-- Add city column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist_users' AND column_name = 'city') THEN
        ALTER TABLE waitlist_users ADD COLUMN city VARCHAR(100);
    END IF;
END $$;

-- Also ensure other location columns exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist_users' AND column_name = 'country') THEN
        ALTER TABLE waitlist_users ADD COLUMN country VARCHAR(100);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist_users' AND column_name = 'region') THEN
        ALTER TABLE waitlist_users ADD COLUMN region VARCHAR(100);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist_users' AND column_name = 'country_code') THEN
        ALTER TABLE waitlist_users ADD COLUMN country_code VARCHAR(3);
    END IF;
END $$;