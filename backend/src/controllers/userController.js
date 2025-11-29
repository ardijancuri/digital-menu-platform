import { query } from '../db/database.js';

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

        res.json({
            success: true,
            settings: result.rows[0]
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
            description,
            opening_hours
        } = req.body;

        const result = await query(
            `UPDATE menu_settings 
       SET primary_color = COALESCE($1, primary_color),
           background_color = COALESCE($2, background_color),
           text_color = COALESCE($3, text_color),
           accent_color = COALESCE($4, accent_color),
           description = COALESCE($5, description),
           opening_hours = COALESCE($6, opening_hours),
           updated_at = NOW()
       WHERE user_id = $7
       RETURNING *`,
            [primary_color, background_color, text_color, accent_color, description, opening_hours, userId]
        );

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings: result.rows[0]
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

        const logoUrl = `/uploads/${req.file.filename}`;

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
        const { name, position } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const result = await query(
            'INSERT INTO categories (user_id, name, position) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, position || 0]
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
        const { name, position } = req.body;

        const result = await query(
            `UPDATE categories 
       SET name = COALESCE($1, name), 
           position = COALESCE($2, position) 
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
            [name, position, id, userId]
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
export const getMenuItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            `SELECT m.*, c.name as category_name 
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
        const { category_id, name, description, price, tag } = req.body;

        if (!category_id || !name || !price) {
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
            `INSERT INTO menu_items (category_id, name, description, price, tag) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [category_id, name, description, price, tag]
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
        const { category_id, name, description, price, tag } = req.body;

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
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           tag = COALESCE($5, tag)
       WHERE id = $6
       RETURNING *`,
            [category_id, name, description, price, tag, id]
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

        const imageUrl = `/uploads/${req.file.filename}`;

        // Verify item belongs to user
        const result = await query(
            `UPDATE menu_items m
       SET image_url = $1
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
            image_url: imageUrl,
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
