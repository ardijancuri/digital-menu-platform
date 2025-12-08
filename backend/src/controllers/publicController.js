import { query } from '../db/database.js';

/**
 * Get public menu by slug
 */
export const getPublicMenu = async (req, res) => {
    try {
        const { slug } = req.params;

        // Get user and menu settings
        const userResult = await query(
            `SELECT u.id, u.business_name, u.slug, u.is_active,
              m.logo_url, m.primary_color, m.background_color, 
              m.text_color, m.accent_color, 
              m.category_bg_color, m.item_card_bg_color, m.border_color, m.header_bg_color,
              m.category_title_color, m.product_name_color, m.description_text_color, m.price_color,
              m.category_icon_color,
              m.business_name_font, m.category_font, m.product_name_font, m.description_font,
              m.description, m.opening_hours, m.banner_images
       FROM users u
       LEFT JOIN menu_settings m ON u.id = m.user_id
       WHERE u.slug = $1 AND u.role = 'user'`,
            [slug]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        const menuData = userResult.rows[0];

        if (!menuData.is_active) {
            return res.status(403).json({
                success: false,
                message: 'This menu is currently unavailable'
            });
        }

        // Get categories
        const categoriesResult = await query(
            'SELECT id, name, position FROM categories WHERE user_id = $1 ORDER BY position ASC, id ASC',
            [menuData.id]
        );

        // Get menu items
        const itemsResult = await query(
            `SELECT id, category_id, name, description, price, images
       FROM menu_items
       WHERE category_id IN (SELECT id FROM categories WHERE user_id = $1)
       ORDER BY id ASC`,
            [menuData.id]
        );

        // Group items by category
        const categories = categoriesResult.rows.map(category => ({
            ...category,
            items: itemsResult.rows.filter(item => item.category_id === category.id)
        }));

        res.json({
            success: true,
            menu: {
                business_name: menuData.business_name,
                slug: menuData.slug,
                logo_url: menuData.logo_url,
                description: menuData.description,
                opening_hours: menuData.opening_hours,
                theme: {
                    primary_color: menuData.primary_color,
                    background_color: menuData.background_color,
                    text_color: menuData.text_color,
                    accent_color: menuData.accent_color,
                    category_bg_color: menuData.category_bg_color,
                    item_card_bg_color: menuData.item_card_bg_color,
                    border_color: menuData.border_color,
                    header_bg_color: menuData.header_bg_color,
                    category_title_color: menuData.category_title_color,
                    product_name_color: menuData.product_name_color,
                    description_text_color: menuData.description_text_color,
                    price_color: menuData.price_color,
                    category_icon_color: menuData.category_icon_color,
                    business_name_font: menuData.business_name_font,
                    category_font: menuData.category_font,
                    product_name_font: menuData.product_name_font,
                    description_font: menuData.description_font,
                    banner_images: menuData.banner_images
                },
                categories
            }
        });
    } catch (error) {
        console.error('Get public menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching menu'
        });
    }
};
