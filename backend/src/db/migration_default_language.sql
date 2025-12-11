-- Add default_language column to menu_settings table
-- This column stores the default language code (en, mk, sq, tr) for the menu

ALTER TABLE menu_settings 
ADD COLUMN IF NOT EXISTS default_language TEXT DEFAULT 'en';

