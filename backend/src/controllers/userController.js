import { query } from '../db/database.js';
import { uploadFile, deleteFile } from '../utils/supabase.js';

/**
 * Get menu settings
 */
export const getSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            'SELECT * FROM menu_settings WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found'
            });
        }

        // Get business_name from users table
        const userResult = await query(
            'SELECT business_name FROM users WHERE id = $1',
            [userId]
        );

        res.json({
            success: true,
            settings: {
                ...result.rows[0],
                business_name: userResult.rows[0]?.business_name || ''
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching settings'
        });
    }
};

/**
 * Update menu settings
 */
export const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            primary_color,
            background_color,
            text_color,
            accent_color,
            category_bg_color,
            item_card_bg_color,
            border_color,
            header_bg_color,
            category_title_color,
            product_name_color,
            description_text_color,
            price_color,
            category_icon_color,
            business_name_font,
            category_font,
            product_name_font,
            description_font,
            description,
            opening_hours,
            banner_images,
            breakline_color,
            business_name,
            default_language
        } = req.body;

        // Update business_name in users table if provided
        if (business_name !== undefined) {
            await query(
                'UPDATE users SET business_name = $1 WHERE id = $2',
                [business_name, userId]
            );
        }

        const result = await query(
            `UPDATE menu_settings 
       SET primary_color = COALESCE($1, primary_color),
           background_color = COALESCE($2, background_color),
           text_color = COALESCE($3, text_color),
           accent_color = COALESCE($4, accent_color),
           category_bg_color = COALESCE($5, category_bg_color),
           item_card_bg_color = COALESCE($6, item_card_bg_color),
           border_color = COALESCE($7, border_color),
           header_bg_color = COALESCE($8, header_bg_color),
           category_title_color = COALESCE($9, category_title_color),
           product_name_color = COALESCE($10, product_name_color),
           description_text_color = COALESCE($11, description_text_color),
           price_color = COALESCE($12, price_color),
           category_icon_color = COALESCE($13, category_icon_color),
           business_name_font = COALESCE($14, business_name_font),
           category_font = COALESCE($15, category_font),
           product_name_font = COALESCE($16, product_name_font),
           description_font = COALESCE($17, description_font),
           description = COALESCE($18, description),
           opening_hours = COALESCE($19, opening_hours),
           banner_images = COALESCE($20, banner_images),
           breakline_color = COALESCE($21, breakline_color),
           default_language = COALESCE($22, default_language),
           updated_at = NOW()
       WHERE user_id = $23
       RETURNING *`,
            [primary_color, background_color, text_color, accent_color,
                category_bg_color, item_card_bg_color, border_color, header_bg_color,
                category_title_color, product_name_color, description_text_color, price_color,
                category_icon_color,
                business_name_font, category_font, product_name_font, description_font,
                description, opening_hours, banner_images, breakline_color, default_language, userId]
        );

        // Get updated business_name from users table
        const userResult = await query(
            'SELECT business_name FROM users WHERE id = $1',
            [userId]
        );

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings: {
                ...result.rows[0],
                business_name: userResult.rows[0]?.business_name
            }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating settings'
        });
    }
};

/**
 * Upload banner image
 */
export const uploadBannerImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const imageUrl = await uploadFile(req.file);

        // Append to banner_images array
        const result = await query(
            `UPDATE menu_settings 
             SET banner_images = array_append(banner_images, $1), 
                 updated_at = NOW() 
             WHERE user_id = $2 
             RETURNING *`,
            [imageUrl, userId]
        );

        res.json({
            success: true,
            message: 'Banner image uploaded successfully',
            imageUrl: imageUrl,
            settings: result.rows[0]
        });
    } catch (error) {
        console.error('Upload banner image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading banner image'
        });
    }
};

/**
 * Delete banner image
 */
export const deleteBannerImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Try to delete from storage
        await deleteFile(imageUrl);

        // Remove from banner_images array
        const result = await query(
            `UPDATE menu_settings 
             SET banner_images = array_remove(banner_images, $1), 
                 updated_at = NOW() 
             WHERE user_id = $2 
             RETURNING *`,
            [imageUrl, userId]
        );

        res.json({
            success: true,
            message: 'Banner image removed successfully',
            settings: result.rows[0]
        });
    } catch (error) {
        console.error('Delete banner image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing banner image'
        });
    }
};

/**
 * Upload logo
 */
export const uploadLogo = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const logoUrl = await uploadFile(req.file);

        const result = await query(
            'UPDATE menu_settings SET logo_url = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
            [logoUrl, userId]
        );

        res.json({
            success: true,
            message: 'Logo uploaded successfully',
            logo_url: logoUrl,
            settings: result.rows[0]
        });
    } catch (error) {
        console.error('Upload logo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading logo'
        });
    }
};

/**
 * Get categories
 */
export const getCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            'SELECT * FROM categories WHERE user_id = $1 ORDER BY position ASC, id ASC',
            [userId]
        );

        res.json({
            success: true,
            categories: result.rows
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories'
        });
    }
};

/**
 * Create category
 */
export const createCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, position, translations, name_mk, name_sq, name_tr } = req.body;

        const resolvedName = name || translations?.en?.name;
        const mk = name_mk || translations?.mk?.name || null;
        const sq = name_sq || translations?.sq?.name || null;
        const tr = name_tr || translations?.tr?.name || null;

        if (!resolvedName) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const result = await query(
            'INSERT INTO categories (user_id, name, name_mk, name_sq, name_tr, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, resolvedName, mk, sq, tr, position || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating category'
        });
    }
};

/**
 * Update category
 */
export const updateCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, position, translations, name_mk, name_sq, name_tr } = req.body;

        const resolvedName = name || translations?.en?.name;
        const mk = name_mk || translations?.mk?.name || null;
        const sq = name_sq || translations?.sq?.name || null;
        const tr = name_tr || translations?.tr?.name || null;

        const result = await query(
            `UPDATE categories 
       SET name = COALESCE($1, name), 
           name_mk = COALESCE($2, name_mk),
           name_sq = COALESCE($3, name_sq),
           name_tr = COALESCE($4, name_tr),
           position = COALESCE($5, position) 
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
            [resolvedName, mk, sq, tr, position, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category updated successfully',
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating category'
        });
    }
};

/**
 * Delete category
 */
export const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await query(
            'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting category'
        });
    }
};

/**
 * Get menu items
 */
/**
 * Get menu items
 */
export const getMenuItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            `SELECT m.*, c.name as category_name, c.name_mk, c.name_sq, c.name_tr
       FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       WHERE c.user_id = $1
       ORDER BY c.position ASC, m.id ASC`,
            [userId]
        );

        res.json({
            success: true,
            items: result.rows
        });
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu items'
        });
    }
};

/**
 * Create menu item
 */
export const createMenuItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            category_id,
            name,
            description,
            price,
            translations,
            name_mk,
            name_sq,
            name_tr,
            description_mk,
            description_sq,
            description_tr
        } = req.body;

        const resolvedName = name || translations?.en?.name;
        const resolvedDescription = description ?? translations?.en?.description ?? null;

        const mkName = name_mk || translations?.mk?.name || null;
        const sqName = name_sq || translations?.sq?.name || null;
        const trName = name_tr || translations?.tr?.name || null;
        const mkDesc = description_mk || translations?.mk?.description || null;
        const sqDesc = description_sq || translations?.sq?.description || null;
        const trDesc = description_tr || translations?.tr?.description || null;

        if (!category_id || !resolvedName || !price) {
            return res.status(400).json({
                success: false,
                message: 'Category, name, and price are required'
            });
        }

        // Verify category belongs to user
        const categoryCheck = await query(
            'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
            [category_id, userId]
        );

        if (categoryCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const result = await query(
            `INSERT INTO menu_items (category_id, name, name_mk, name_sq, name_tr, description, description_mk, description_sq, description_tr, price, images) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ARRAY[]::TEXT[]) 
       RETURNING *`,
            [category_id, resolvedName, mkName, sqName, trName, resolvedDescription, mkDesc, sqDesc, trDesc, price]
        );

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            item: result.rows[0]
        });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating menu item'
        });
    }
};

/**
 * Update menu item
 */
export const updateMenuItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const {
            category_id,
            name,
            description,
            price,
            translations,
            name_mk,
            name_sq,
            name_tr,
            description_mk,
            description_sq,
            description_tr
        } = req.body;

        const resolvedName = name || translations?.en?.name;
        const resolvedDescription = description ?? translations?.en?.description ?? null;

        const mkName = name_mk || translations?.mk?.name || null;
        const sqName = name_sq || translations?.sq?.name || null;
        const trName = name_tr || translations?.tr?.name || null;
        const mkDesc = description_mk || translations?.mk?.description || null;
        const sqDesc = description_sq || translations?.sq?.description || null;
        const trDesc = description_tr || translations?.tr?.description || null;

        // Verify item belongs to user
        const itemCheck = await query(
            `SELECT m.id FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       WHERE m.id = $1 AND c.user_id = $2`,
            [id, userId]
        );

        if (itemCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        const result = await query(
            `UPDATE menu_items 
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           name_mk = COALESCE($3, name_mk),
           name_sq = COALESCE($4, name_sq),
           name_tr = COALESCE($5, name_tr),
           description = COALESCE($6, description),
           description_mk = COALESCE($7, description_mk),
           description_sq = COALESCE($8, description_sq),
           description_tr = COALESCE($9, description_tr),
           price = COALESCE($10, price)
       WHERE id = $11
       RETURNING *`,
            [category_id, resolvedName, mkName, sqName, trName, resolvedDescription, mkDesc, sqDesc, trDesc, price, id]
        );

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            item: result.rows[0]
        });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating menu item'
        });
    }
};

/**
 * Delete menu item
 */
export const deleteMenuItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await query(
            `DELETE FROM menu_items m
       USING categories c
       WHERE m.category_id = c.id AND m.id = $1 AND c.user_id = $2
       RETURNING m.*`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting menu item'
        });
    }
};

/**
 * Upload menu item image
 */
export const uploadItemImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'Item ID is required'
            });
        }

        const imageUrl = await uploadFile(req.file);

        // Verify item belongs to user
        const result = await query(
            `UPDATE menu_items m
       SET images = array_append(images, $1)
       FROM categories c
       WHERE m.category_id = c.id AND m.id = $2 AND c.user_id = $3
       RETURNING m.*`,
            [imageUrl, itemId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            item: result.rows[0]
        });
    } catch (error) {
        console.error('Upload item image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading image'
        });
    }
};

/**
 * Delete menu item image
 */
export const deleteItemImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, imageUrl } = req.body;

        if (!itemId || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Item ID and Image URL are required'
            });
        }

        // Try to delete from storage
        await deleteFile(imageUrl);

        const result = await query(
            `UPDATE menu_items m
       SET images = array_remove(images, $1)
       FROM categories c
       WHERE m.category_id = c.id AND m.id = $2 AND c.user_id = $3
       RETURNING m.*`,
            [imageUrl, itemId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Image removed successfully',
            item: result.rows[0]
        });
    } catch (error) {
        console.error('Delete item image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing image'
        });
    }
};
