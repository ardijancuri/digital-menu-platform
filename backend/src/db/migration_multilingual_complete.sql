-- Complete SQL Migration for Multilingual Support
-- Run this file in production to add all multilingual features

BEGIN;

-- ============================================
-- 1. Add language columns to categories table
-- ============================================
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS name_mk TEXT,
  ADD COLUMN IF NOT EXISTS name_sq TEXT,
  ADD COLUMN IF NOT EXISTS name_tr TEXT;

-- ============================================
-- 2. Add language columns to menu_items table
-- ============================================
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS name_mk TEXT,
  ADD COLUMN IF NOT EXISTS name_sq TEXT,
  ADD COLUMN IF NOT EXISTS name_tr TEXT,
  ADD COLUMN IF NOT EXISTS description_mk TEXT,
  ADD COLUMN IF NOT EXISTS description_sq TEXT,
  ADD COLUMN IF NOT EXISTS description_tr TEXT;

-- ============================================
-- 3. Add default_language column to menu_settings table
-- ============================================
ALTER TABLE menu_settings 
  ADD COLUMN IF NOT EXISTS default_language TEXT DEFAULT 'en';

-- ============================================
-- 4. Add indexes for better performance
-- ============================================

-- Category name indexes
CREATE INDEX IF NOT EXISTS idx_categories_name_mk ON categories (name_mk);
CREATE INDEX IF NOT EXISTS idx_categories_name_sq ON categories (name_sq);
CREATE INDEX IF NOT EXISTS idx_categories_name_tr ON categories (name_tr);

-- Menu item name indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_name_mk ON menu_items (name_mk);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_sq ON menu_items (name_sq);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_tr ON menu_items (name_tr);

-- Menu item description indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_desc_mk ON menu_items (description_mk);
CREATE INDEX IF NOT EXISTS idx_menu_items_desc_sq ON menu_items (description_sq);
CREATE INDEX IF NOT EXISTS idx_menu_items_desc_tr ON menu_items (description_tr);

COMMIT;

-- ============================================
-- Verification queries (optional - run to verify)
-- ============================================
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'categories' 
-- AND column_name LIKE 'name_%';
--
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'menu_items' 
-- AND (column_name LIKE 'name_%' OR column_name LIKE 'description_%');
--
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'menu_settings' 
-- AND column_name = 'default_language';

