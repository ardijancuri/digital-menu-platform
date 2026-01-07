-- Migration: Add meta_title column to menu_settings table
-- This column stores the SEO title for the public menu page

ALTER TABLE menu_settings ADD COLUMN IF NOT EXISTS meta_title TEXT;

-- Create index for meta_title to improve query performance
CREATE INDEX IF NOT EXISTS idx_menu_settings_meta_title ON menu_settings(meta_title);

-- Success message
SELECT 'meta_title column and index added to menu_settings table' AS message;

