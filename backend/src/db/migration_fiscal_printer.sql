-- Add fiscal_printer_enabled column to menu_settings table
-- This column stores whether the fiscal printer integration is enabled
-- When enabled, fiscal receipts will be printed via Tremol/DAVID fiscal printer

ALTER TABLE menu_settings 
ADD COLUMN IF NOT EXISTS fiscal_printer_enabled BOOLEAN DEFAULT FALSE;

-- Create index for fiscal_printer_enabled column for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_settings_fiscal_printer_enabled ON menu_settings(fiscal_printer_enabled);
