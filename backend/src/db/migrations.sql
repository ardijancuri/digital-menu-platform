-- Digital Menu Platform Database Schema
-- Run this file to create all necessary tables

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS daily_revenue CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
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
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table: stores approved users and admin
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    business_name TEXT NOT NULL,
    email TEXT UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    username TEXT UNIQUE,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT users_manager_constraints 
        CHECK (
            (role = 'manager' AND username IS NOT NULL AND owner_id IS NOT NULL) OR
            (role != 'manager')
        )
);

-- Menu settings table: stores branding and customization
CREATE TABLE menu_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#1f2937',
    background_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#111827',
    accent_color TEXT DEFAULT '#f7f7f7',
    category_bg_color TEXT DEFAULT '#f9fafb',
    item_card_bg_color TEXT DEFAULT '#ffffff',
    border_color TEXT DEFAULT '#e5e7eb',
    header_bg_color TEXT DEFAULT '#ffffff',
    category_title_color TEXT DEFAULT '#1f2937',
    product_name_color TEXT DEFAULT '#1f2937',
    description_text_color TEXT DEFAULT '#6b7280',
    price_color TEXT DEFAULT '#3d72c7',
    category_icon_color TEXT DEFAULT '#374151',
    breakline_color TEXT DEFAULT '#e5e7eb',
    business_name_font TEXT DEFAULT 'Montserrat',
    category_font TEXT DEFAULT 'Roboto Condensed',
    product_name_font TEXT DEFAULT 'Montserrat',
    description_font TEXT DEFAULT 'Quicksand',
    description TEXT,
    opening_hours TEXT,
    banner_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    default_language TEXT DEFAULT 'en',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table: menu categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_mk TEXT,
    name_sq TEXT,
    name_tr TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table: products/dishes
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_mk TEXT,
    name_sq TEXT,
    name_tr TEXT,
    description TEXT,
    description_mk TEXT,
    description_sq TEXT,
    description_tr TEXT,
    price NUMERIC(10, 2) NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
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
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_owner_id ON users(owner_id);
CREATE INDEX idx_menu_settings_user_id ON menu_settings(user_id);
CREATE INDEX idx_menu_settings_banner_images ON menu_settings USING GIN (banner_images);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_name_mk ON categories(name_mk);
CREATE INDEX idx_categories_name_sq ON categories(name_sq);
CREATE INDEX idx_categories_name_tr ON categories(name_tr);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_name_mk ON menu_items(name_mk);
CREATE INDEX idx_menu_items_name_sq ON menu_items(name_sq);
CREATE INDEX idx_menu_items_name_tr ON menu_items(name_tr);
CREATE INDEX idx_menu_items_desc_mk ON menu_items(description_mk);
CREATE INDEX idx_menu_items_desc_sq ON menu_items(description_sq);
CREATE INDEX idx_menu_items_desc_tr ON menu_items(description_tr);
CREATE INDEX idx_menu_items_images ON menu_items USING GIN (images);

-- POS Tables

-- Tables table: physical tables in the restaurant
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 4,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Staff table: restaurant employees
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    role TEXT DEFAULT 'server' CHECK (role IN ('admin', 'manager', 'server', 'kitchen')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table: customer orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
    staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online', NULL)),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table: items within an order
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL, -- Snapshot of price at time of order
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily revenue table: stores daily revenue reports
CREATE TABLE daily_revenue (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_revenue NUMERIC(10, 2) DEFAULT 0.00,
    order_count INTEGER DEFAULT 0,
    staff_revenue JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for POS tables
CREATE INDEX idx_tables_user_id ON tables(user_id);
CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_staff_id ON orders(staff_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_daily_revenue_user_id ON daily_revenue(user_id);
CREATE INDEX idx_daily_revenue_date ON daily_revenue(date);

-- Success message
-- Create default admin user
-- Email: admin@example.com
-- Password: admin123
INSERT INTO users (business_name, email, slug, password_hash, role, is_active)
VALUES (
    'Platform Admin', 
    'admin@example.com', 
    'admin', 
    '$2a$10$bwGSdhDzpNzZQwJBKZTohesSPwpNJZn56kFQPFhiC/sXTPj7X9672', 
    'admin', 
    true
);

-- Success message
SELECT 'Database schema created successfully!' AS message;
