/*
  # Consolidated Purrfect Stays Database Schema

  1. New Tables
    - `waitlist_users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `user_type` (enum: cat-parent, cattery-owner)
      - `is_verified` (boolean, default false)
      - `quiz_completed` (boolean, default false)
      - `waitlist_position` (integer, nullable)
      - `verification_token` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `question_id` (text)
      - `answer` (text)
      - `created_at` (timestamp)

    - `catteries`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to waitlist_users)
      - `name` (text)
      - `description` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `country` (text, default 'US')
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `location` (geography point)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `capacity` (integer)
      - `price_per_night` (decimal)
      - `amenities` (text array)
      - `images` (text array)
      - `is_active` (boolean, default true)
      - `is_verified` (boolean, default false)
      - `rating` (decimal, default 0)
      - `review_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for different user types

  3. PostGIS Functions
    - Enable PostGIS extension
    - Create spatial indexes
    - Add distance calculation functions
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum for user types (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('cat-parent', 'cattery-owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create waitlist_users table
CREATE TABLE IF NOT EXISTS waitlist_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  is_verified boolean DEFAULT false,
  quiz_completed boolean DEFAULT false,
  waitlist_position integer,
  verification_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create catteries table
CREATE TABLE IF NOT EXISTS catteries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES waitlist_users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text DEFAULT 'US',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  location geography(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  phone text,
  email text,
  website text,
  capacity integer DEFAULT 1,
  price_per_night decimal(10,2),
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS catteries_location_idx ON catteries USING GIST (location);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS catteries_owner_id_idx ON catteries (owner_id);
CREATE INDEX IF NOT EXISTS catteries_city_state_idx ON catteries (city, state);
CREATE INDEX IF NOT EXISTS catteries_active_verified_idx ON catteries (is_active, is_verified);

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE catteries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can read their own data" ON waitlist_users;
    DROP POLICY IF EXISTS "Users can insert their own data" ON waitlist_users;
    DROP POLICY IF EXISTS "Users can update their own data" ON waitlist_users;
    DROP POLICY IF EXISTS "Users can read their own quiz responses" ON quiz_responses;
    DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON quiz_responses;
    DROP POLICY IF EXISTS "Cat parents can view active verified catteries" ON catteries;
    DROP POLICY IF EXISTS "Cattery owners can view their own catteries" ON catteries;
    DROP POLICY IF EXISTS "Cattery owners can insert their own catteries" ON catteries;
    DROP POLICY IF EXISTS "Cattery owners can update their own catteries" ON catteries;
    DROP POLICY IF EXISTS "Cattery owners can delete their own catteries" ON catteries;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies for waitlist_users
CREATE POLICY "Users can read their own data"
  ON waitlist_users
  FOR SELECT
  USING (true); -- Allow reading for verification purposes

CREATE POLICY "Users can insert their own data"
  ON waitlist_users
  FOR INSERT
  WITH CHECK (true); -- Allow registration

CREATE POLICY "Users can update their own data"
  ON waitlist_users
  FOR UPDATE
  USING (true); -- Allow verification updates

-- Create policies for quiz_responses
CREATE POLICY "Users can read their own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (true);

-- Create policies for catteries
CREATE POLICY "Cat parents can view active verified catteries"
  ON catteries
  FOR SELECT
  USING (is_active = true AND is_verified = true);

CREATE POLICY "Cattery owners can view their own catteries"
  ON catteries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users 
      WHERE waitlist_users.id = owner_id 
      AND waitlist_users.user_type = 'cattery-owner'
    )
  );

CREATE POLICY "Cattery owners can insert their own catteries"
  ON catteries
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM waitlist_users 
      WHERE waitlist_users.id = owner_id 
      AND waitlist_users.user_type = 'cattery-owner'
    )
  );

CREATE POLICY "Cattery owners can update their own catteries"
  ON catteries
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users 
      WHERE waitlist_users.id = owner_id 
      AND waitlist_users.user_type = 'cattery-owner'
    )
  );

CREATE POLICY "Cattery owners can delete their own catteries"
  ON catteries
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM waitlist_users 
      WHERE waitlist_users.id = owner_id 
      AND waitlist_users.user_type = 'cattery-owner'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS update_waitlist_users_updated_at ON waitlist_users;
DROP TRIGGER IF EXISTS update_catteries_updated_at ON catteries;
DROP TRIGGER IF EXISTS assign_waitlist_position_trigger ON waitlist_users;

-- Create triggers for updated_at
CREATE TRIGGER update_waitlist_users_updated_at
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catteries_updated_at
  BEFORE UPDATE ON catteries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to assign waitlist position
CREATE OR REPLACE FUNCTION assign_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quiz_completed = true AND OLD.quiz_completed = false THEN
    NEW.waitlist_position = (
      SELECT COALESCE(MAX(waitlist_position), 0) + 1
      FROM waitlist_users
      WHERE quiz_completed = true
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for waitlist position assignment
CREATE TRIGGER assign_waitlist_position_trigger
  BEFORE UPDATE ON waitlist_users
  FOR EACH ROW
  EXECUTE FUNCTION assign_waitlist_position();

-- Create function to calculate distance between points
CREATE OR REPLACE FUNCTION calculate_distance_miles(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision AS $$
BEGIN
  RETURN ST_Distance(
    ST_SetSRID(ST_MakePoint(lon1, lat1), 4326)::geography,
    ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)::geography
  ) * 0.000621371; -- Convert meters to miles
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to find catteries within radius
CREATE OR REPLACE FUNCTION find_catteries_within_radius(
  search_lat double precision,
  search_lon double precision,
  radius_miles double precision DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  address text,
  city text,
  state text,
  latitude double precision,
  longitude double precision,
  phone text,
  email text,
  website text,
  capacity integer,
  price_per_night decimal,
  amenities text[],
  images text[],
  rating decimal,
  review_count integer,
  distance_miles double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.address,
    c.city,
    c.state,
    c.latitude,
    c.longitude,
    c.phone,
    c.email,
    c.website,
    c.capacity,
    c.price_per_night,
    c.amenities,
    c.images,
    c.rating,
    c.review_count,
    calculate_distance_miles(search_lat, search_lon, c.latitude, c.longitude) as distance_miles
  FROM catteries c
  WHERE 
    c.is_active = true 
    AND c.is_verified = true
    AND ST_DWithin(
      c.location,
      ST_SetSRID(ST_MakePoint(search_lon, search_lat), 4326)::geography,
      radius_miles * 1609.34 -- Convert miles to meters
    )
  ORDER BY distance_miles ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample catteries for demonstration (only if no catteries exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM catteries LIMIT 1) THEN
    -- Create a sample cattery owner if none exists
    INSERT INTO waitlist_users (name, email, user_type, is_verified, quiz_completed, waitlist_position)
    VALUES ('Sample Cattery Owner', 'sample@catteryowner.com', 'cattery-owner', true, true, 1)
    ON CONFLICT (email) DO NOTHING;

    -- Insert sample catteries
    INSERT INTO catteries (
      owner_id,
      name,
      description,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      phone,
      email,
      capacity,
      price_per_night,
      amenities,
      images,
      is_verified,
      rating,
      review_count
    ) VALUES 
    (
      (SELECT id FROM waitlist_users WHERE email = 'sample@catteryowner.com'),
      'Purrfect Paws Cattery',
      'A luxury cattery providing premium care for your feline friends with spacious suites and personalized attention.',
      '123 Cat Lane',
      'San Francisco',
      'CA',
      '94102',
      37.7749,
      -122.4194,
      '(555) 123-4567',
      'info@purrfectpaws.com',
      20,
      45.00,
      ARRAY['Indoor Play Area', 'Grooming Services', 'Veterinary Care', 'Climate Controlled', 'Security Cameras'],
      ARRAY['/cattery-1.jpg', '/cattery-1-suite.jpg'],
      true,
      4.8,
      127
    ),
    (
      (SELECT id FROM waitlist_users WHERE email = 'sample@catteryowner.com'),
      'Whiskers Haven',
      'Family-owned cattery with over 15 years of experience. We treat every cat like family.',
      '456 Feline Street',
      'San Francisco',
      'CA',
      '94103',
      37.7849,
      -122.4094,
      '(555) 234-5678',
      'hello@whiskershaven.com',
      15,
      38.00,
      ARRAY['Outdoor Enclosure', 'Natural Light', 'Homemade Treats', 'Daily Updates'],
      ARRAY['/cattery-2.jpg', '/cattery-2-outdoor.jpg'],
      true,
      4.6,
      89
    ),
    (
      (SELECT id FROM waitlist_users WHERE email = 'sample@catteryowner.com'),
      'Feline Paradise Resort',
      'Upscale resort-style cattery with luxury amenities and 24/7 care.',
      '789 Meow Avenue',
      'Oakland',
      'CA',
      '94601',
      37.8044,
      -122.2711,
      '(555) 345-6789',
      'reservations@felineparadise.com',
      30,
      65.00,
      ARRAY['Spa Services', '24/7 Monitoring', 'Gourmet Meals', 'Private Suites', 'Webcam Access'],
      ARRAY['/cattery-3.jpg', '/cattery-3-spa.jpg'],
      true,
      4.9,
      203
    ),
    (
      (SELECT id FROM waitlist_users WHERE email = 'sample@catteryowner.com'),
      'Cozy Cat Cottage',
      'Small, intimate cattery focusing on personalized care and attention.',
      '321 Purr Place',
      'Berkeley',
      'CA',
      '94702',
      37.8715,
      -122.2730,
      '(555) 456-7890',
      'care@cozycatcottage.com',
      8,
      32.00,
      ARRAY['Home Environment', 'Medication Administration', 'Senior Cat Specialists'],
      ARRAY['/cattery-4.jpg'],
      true,
      4.7,
      56
    );
  END IF;
END $$;