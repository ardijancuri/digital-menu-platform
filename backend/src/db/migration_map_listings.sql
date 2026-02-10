-- Map Listings table: businesses shown on the public map
-- Includes both platform users (linked via user_id) and external businesses (user_id NULL)

CREATE TABLE IF NOT EXISTS map_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'external' CHECK (source IN ('platform', 'external')),
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL DEFAULT 'restaurant'
        CHECK (business_type IN ('restaurant', 'cafe', 'bar', 'bakery', 'fast_food', 'pizzeria', 'pub', 'other')),
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone TEXT,
    email TEXT,
    website_url TEXT,
    menu_slug TEXT,
    opening_hours JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_map_listings_user_id ON map_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_map_listings_business_type ON map_listings(business_type);
CREATE INDEX IF NOT EXISTS idx_map_listings_is_active ON map_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_map_listings_is_featured ON map_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_map_listings_location ON map_listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_map_listings_source ON map_listings(source);

SELECT 'Migration applied: Created map_listings table' as message;
