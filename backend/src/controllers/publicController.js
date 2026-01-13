import { query } from '../db/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get menu SEO data for generating HTML page
 */
const getMenuSeoData = async (slug) => {
    const result = await query(
        `SELECT u.business_name, u.slug, u.is_active,
                m.logo_url, m.description, m.meta_title
         FROM users u
         LEFT JOIN menu_settings m ON u.id = m.user_id
         WHERE u.slug = $1 AND u.role = 'user'`,
        [slug]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Escape HTML entities to prevent XSS
 */
const escapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Serve HTML page with SEO meta tags for menu (subdomain or path-based)
 * This endpoint serves a full HTML page that Google can crawl.
 * Works for both subdomain access (studio-cafe.onipos.com) and path access (/menu/studio-cafe)
 */
export const getMenuHtml = async (req, res) => {
    try {
        // Get slug from params (path-based) or from subdomain
        const slug = req.params.slug || req.subdomainSlug;

        if (!slug) {
            return res.status(400).send('Menu not specified');
        }

        const menuData = await getMenuSeoData(slug);

        if (!menuData) {
            return res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Menu Not Found - OniPOS</title>
    <meta name="robots" content="noindex">
</head>
<body>
    <h1>Menu not found</h1>
</body>
</html>`);
        }

        if (!menuData.is_active) {
            return res.status(403).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Menu Unavailable - OniPOS</title>
    <meta name="robots" content="noindex">
</head>
<body>
    <h1>This menu is currently unavailable</h1>
</body>
</html>`);
        }

        const title = menuData.meta_title || menuData.business_name || 'Menu';
        const description = menuData.description || `Digital menu for ${menuData.business_name}`;
        const logoUrl = menuData.logo_url || 'https://onipos.com/favicon.png';
        // Use subdomain URL as canonical for subdomain requests
        const canonicalUrl = req.subdomainSlug
            ? `https://${slug}.onipos.com/`
            : `https://onipos.com/menu/${slug}`;

        const safeTitle = escapeHtml(title);
        const safeDescription = escapeHtml(description);
        const safeBusinessName = escapeHtml(menuData.business_name);

        // Try to read the built frontend index.html
        const frontendDistPath = path.join(__dirname, '../../../frontend/dist/index.html');

        let html;

        if (fs.existsSync(frontendDistPath)) {
            // Production: Read the built frontend and inject SEO meta tags
            html = fs.readFileSync(frontendDistPath, 'utf-8');

            // Extract the script and stylesheet links from the original head (Vite build assets)
            // Match any script tag with src containing /assets/ (handles type="module", crossorigin, etc.)
            const scriptMatches = html.match(/<script[^>]*src="[^"]*\/assets\/[^"]*"[^>]*><\/script>/gi) || [];
            // Match any link tag with href containing /assets/ (stylesheets)
            const styleMatches = html.match(/<link[^>]*href="[^"]*\/assets\/[^"]*"[^>]*>/gi) || [];
            // Match lib scripts
            const libScripts = html.match(/<script[^>]*src="[^"]*\/libs\/[^"]*"[^>]*><\/script>/gi) || [];

            // Build a clean head with only client SEO data
            const newHead = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="${logoUrl}">

    <!-- Primary Meta Tags -->
    <title>${safeTitle}</title>
    <meta name="title" content="${safeTitle}">
    <meta name="description" content="${safeDescription}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${logoUrl}">
    <meta property="og:site_name" content="${safeBusinessName}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${logoUrl}">

    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">

    <!-- App Assets -->
    ${libScripts.join('\n    ')}
    ${scriptMatches.join('\n    ')}
    ${styleMatches.join('\n    ')}
</head>`;

            // Replace the entire head section (handles both <head> and <HEAD>)
            html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, newHead);
        } else {
            // Development or fallback: Serve a basic HTML page with SEO tags
            html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags (SEO) -->
    <title>${safeTitle}</title>
    <meta name="title" content="${safeTitle}">
    <meta name="description" content="${safeDescription}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${logoUrl}">
    <meta property="og:site_name" content="${safeBusinessName}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${logoUrl}">

    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" type="image/png" href="${logoUrl}">
</head>
<body>
    <noscript>
        <h1>${safeBusinessName}</h1>
        <p>${safeDescription}</p>
        <p>Please enable JavaScript to view the full menu.</p>
    </noscript>
    <div id="root">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, sans-serif;">
            <div style="text-align: center;">
                <h1 style="margin-bottom: 8px;">${safeBusinessName}</h1>
                <p style="color: #666;">${safeDescription}</p>
                <p style="color: #999; font-size: 14px;">Loading menu...</p>
            </div>
        </div>
    </div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;
        }

        res.send(html);
    } catch (error) {
        console.error('Get menu HTML error:', error);
        res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error - OniPOS</title>
</head>
<body>
    <h1>Server error</h1>
</body>
</html>`);
    }
};

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
              m.description, m.opening_hours, m.banner_images, m.breakline_color, m.default_language,
              m.meta_title
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
            `SELECT id, name, name_mk, name_sq, name_tr, position 
             FROM categories 
             WHERE user_id = $1 
             ORDER BY position ASC, id ASC`,
            [menuData.id]
        );

        // Get menu items
        const itemsResult = await query(
            `SELECT id, category_id, name, name_mk, name_sq, name_tr, description, description_mk, description_sq, description_tr, price, images
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
                meta_title: menuData.meta_title,
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
                    breakline_color: menuData.breakline_color,
                    business_name_font: menuData.business_name_font,
                    category_font: menuData.category_font,
                    product_name_font: menuData.product_name_font,
                    description_font: menuData.description_font,
                    banner_images: menuData.banner_images
                },
                default_language: menuData.default_language || 'en',
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
