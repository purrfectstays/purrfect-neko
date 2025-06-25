/*
  # Create Catteries Schema with PostGIS Support

  1. New Tables
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
    - Enable RLS on catteries table
    - Add policies for different user types
    - Cat parents can read all active catteries
    - Cattery owners can manage their own listings

  3. PostGIS Functions
    - Enable PostGIS extension
    - Create spatial indexes
    - Add distance calculation functions
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

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
ALTER TABLE catteries ENABLE ROW LEVEL SECURITY;

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

-- Create trigger for updated_at
CREATE TRIGGER update_catteries_updated_at
  BEFORE UPDATE ON catteries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- Insert sample catteries for demonstration
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
  (SELECT id FROM waitlist_users WHERE user_type = 'cattery-owner' LIMIT 1),
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
  (SELECT id FROM waitlist_users WHERE user_type = 'cattery-owner' LIMIT 1),
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
  (SELECT id FROM waitlist_users WHERE user_type = 'cattery-owner' LIMIT 1),
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
  (SELECT id FROM waitlist_users WHERE user_type = 'cattery-owner' LIMIT 1),
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