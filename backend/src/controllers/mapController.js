import { query } from '../db/database.js';
import { normalizeBusinessType } from '../utils/businessTypes.js';

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get all active map listings (public, no auth)
 * Supports ?type=, ?search=, ?featured=true
 */
export const getMapListings = async (req, res) => {
    try {
        const { type, search, featured } = req.query;

        let queryText = `
            SELECT id, business_name, business_type, address,
                   latitude, longitude, phone, email, website_url, menu_slug,
                   opening_hours, is_featured, source
            FROM map_listings
            WHERE is_active = true
              AND latitude IS NOT NULL
              AND longitude IS NOT NULL
        `;
        const params = [];
        let paramIndex = 1;

        if (type) {
            queryText += ` AND business_type = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        if (search) {
            queryText += ` AND business_name ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (featured === 'true') {
            queryText += ` AND is_featured = true`;
        }

        queryText += ` ORDER BY is_featured DESC, business_name ASC`;

        const result = await query(queryText, params);

        res.json({ success: true, listings: result.rows });
    } catch (error) {
        console.error('Get map listings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * Get all map listings for admin (includes inactive)
 */
export const getAdminMapListings = async (req, res) => {
    try {
        const result = await query(
            `SELECT ml.*, u.slug as user_slug, u.business_name as user_business_name
             FROM map_listings ml
             LEFT JOIN users u ON ml.user_id = u.id
             ORDER BY ml.created_at DESC`
        );

        res.json({ success: true, listings: result.rows });
    } catch (error) {
        console.error('Get admin map listings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Create a new map listing
 */
export const createMapListing = async (req, res) => {
    try {
        const {
            user_id, business_name, business_type, address,
            latitude, longitude, phone, email, website_url,
            menu_slug, opening_hours, is_featured, is_active
        } = req.body;
        const normalizedBusinessType = normalizeBusinessType(business_type);

        if (!business_name || !normalizedBusinessType) {
            return res.status(400).json({
                success: false,
                message: 'Business name and type are required'
            });
        }

        const source = user_id ? 'platform' : 'external';

        const result = await query(
            `INSERT INTO map_listings
                (user_id, source, business_name, business_type, address,
                 latitude, longitude, phone, email, website_url,
                 menu_slug, opening_hours, is_featured, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [
                user_id || null, source, business_name, normalizedBusinessType,
                address || null, latitude || null, longitude || null,
                phone || null, email || null, website_url || null,
                menu_slug || null,
                opening_hours ? JSON.stringify(opening_hours) : '{}',
                is_featured || false, is_active || false
            ]
        );

        res.json({ success: true, listing: result.rows[0] });
    } catch (error) {
        console.error('Create map listing error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Update a map listing
 */
export const updateMapListing = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            business_name, business_type, address,
            latitude, longitude, phone, email, website_url,
            menu_slug, opening_hours, is_featured, is_active
        } = req.body;
        const normalizedBusinessType = normalizeBusinessType(business_type);

        if (!business_name || !normalizedBusinessType) {
            return res.status(400).json({
                success: false,
                message: 'Business name and type are required'
            });
        }

        const result = await query(
            `UPDATE map_listings SET
                business_name = $1, business_type = $2, address = $3,
                latitude = $4, longitude = $5, phone = $6, email = $7,
                website_url = $8, menu_slug = $9, opening_hours = $10,
                is_featured = $11, is_active = $12, updated_at = NOW()
             WHERE id = $13
            RETURNING *`,
            [
                business_name, normalizedBusinessType, address || null,
                latitude || null, longitude || null,
                phone || null, email || null, website_url || null,
                menu_slug || null,
                opening_hours ? JSON.stringify(opening_hours) : '{}',
                is_featured || false, is_active || false,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({ success: true, listing: result.rows[0] });
    } catch (error) {
        console.error('Update map listing error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Delete a map listing
 */
export const deleteMapListing = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM map_listings WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({ success: true, message: 'Listing deleted' });
    } catch (error) {
        console.error('Delete map listing error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get platform users that don't yet have a map listing
 */
export const getUnlinkedPlatformUsers = async (req, res) => {
    try {
        const result = await query(
            `SELECT u.id, u.business_name, u.email, u.slug
             FROM users u
             WHERE u.role = 'user' AND u.is_active = true
               AND u.id NOT IN (SELECT user_id FROM map_listings WHERE user_id IS NOT NULL)
             ORDER BY u.business_name ASC`
        );

        res.json({ success: true, users: result.rows });
    } catch (error) {
        console.error('Get unlinked platform users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
