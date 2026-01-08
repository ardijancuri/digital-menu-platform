-- Add takeaway_only column to menu_settings table
-- This column stores whether the restaurant operates in takeaway-only mode
-- When enabled, the Tables page will be hidden and disabled in the POS system

ALTER TABLE menu_settings 
ADD COLUMN IF NOT EXISTS takeaway_only BOOLEAN DEFAULT FALSE;

-- Create index for takeaway_only column for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_settings_takeaway_only ON menu_settings(takeaway_only);
