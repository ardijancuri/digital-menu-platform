-- Digital Menu Platform Database Schema
-- Run this file to create all necessary tables

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS menu_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

-- Applications table: stores pending/approved/rejected applications
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table: stores approved users and admin
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    business_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Menu settings table: stores branding and customization
CREATE TABLE menu_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#1f2937',
    background_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#111827',
    accent_color TEXT DEFAULT '#3b82f6',
    description TEXT,
    opening_hours TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table: menu categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table: products/dishes
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    tag TEXT CHECK (tag IN ('New', 'Hot', 'Bestseller', NULL)),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_slug ON applications(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_slug ON users(slug);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_menu_settings_user_id ON menu_settings(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

-- Success message
SELECT 'Database schema created successfully!' AS message;
