-- Migration script to add daily_revenue table for staff revenue tracking
-- Run this script on your existing database

-- Daily revenue table: stores daily revenue reports
CREATE TABLE IF NOT EXISTS daily_revenue (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_revenue NUMERIC(10, 2) DEFAULT 0.00,
    order_count INTEGER DEFAULT 0,
    staff_revenue JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_revenue_user_id ON daily_revenue(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_revenue_date ON daily_revenue(date);

-- Add index for orders staff_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_orders_staff_id ON orders(staff_id);

