-- Remove tag column from menu_items table
ALTER TABLE menu_items 
DROP COLUMN IF EXISTS tag;

SELECT 'Migration applied: Dropped tag column from menu_items' as message;
