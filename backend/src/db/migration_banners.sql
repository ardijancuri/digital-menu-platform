-- Add banner_images column to menu_settings table
ALTER TABLE menu_settings 
ADD COLUMN banner_images TEXT[] DEFAULT ARRAY[]::TEXT[];

SELECT 'Migration applied: Added banner_images to menu_settings' as message;
