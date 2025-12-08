-- Add images column to menu_items table
ALTER TABLE menu_items 
ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing image_url to images array
UPDATE menu_items 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL;

-- Drop old column
ALTER TABLE menu_items 
DROP COLUMN image_url;

SELECT 'Migration applied: Converted image_url to images array' as message;
