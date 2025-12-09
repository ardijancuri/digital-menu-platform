import { query, getClient } from '../db/database.js';

/**
 * Get all applications
 */
export const getApplications = async (req, res) => {
    try {
        const { status } = req.query;

        let queryText = 'SELECT * FROM applications ORDER BY created_at DESC';
        let params = [];

        if (status) {
            queryText = 'SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC';
            params = [status];
        }

        const result = await query(queryText, params);

        res.json({
            success: true,
            applications: result.rows
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching applications'
        });
    }
};

/**
 * Approve application
 */
export const approveApplication = async (req, res) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Get application details
        const appResult = await client.query(
            'SELECT * FROM applications WHERE id = $1',
            [id]
        );

        if (appResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const application = appResult.rows[0];

        if (application.status === 'approved') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Application already approved'
            });
        }

        // Create user account
        const userResult = await client.query(
            `INSERT INTO users (business_name, email, slug, password_hash, role) 
       VALUES ($1, $2, $3, $4, 'user') 
       RETURNING id`,
            [application.business_name, application.email, application.slug, application.password_hash]
        );

        const userId = userResult.rows[0].id;

        // Create menu settings with default values
        await client.query(
            `INSERT INTO menu_settings (
                user_id,
                primary_color,
                background_color,
                text_color,
                accent_color,
                category_icon_color,
                product_name_color,
                price_color,
                breakline_color
            ) VALUES (
                $1,
                '#1f2937',     -- primary
                '#ffffff',     -- background
                '#111827',     -- text (unused but kept)
                '#f7f7f7',     -- accent
                '#374151',     -- hide/show text & icon
                '#1f2937',     -- product name
                '#3d72c7',     -- price
                '#e5e7eb'      -- breakline
            )`,
            [userId]
        );

        // Update application status
        await client.query(
            'UPDATE applications SET status = $1 WHERE id = $2',
            ['approved', id]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Application approved successfully',
            user: {
                id: userId,
                slug: application.slug,
                dashboard_url: `/dashboard/${application.slug}`
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Approve application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving application'
        });
    } finally {
        client.release();
    }
};

/**
 * Reject application
 */
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
            ['rejected', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application rejected',
            application: result.rows[0]
        });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rejecting application'
        });
    }
};

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
    try {
        const result = await query(
            `SELECT u.id, u.business_name, u.email, u.slug, u.role, u.is_active, u.created_at,
              m.logo_url, m.primary_color
       FROM users u
       LEFT JOIN menu_settings m ON u.id = m.user_id
       WHERE u.role = 'user'
       ORDER BY u.created_at DESC`
        );

        res.json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'UPDATE users SET is_active = NOT is_active WHERE id = $1 AND role = $2 RETURNING *',
            [id, 'user']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `User ${result.rows[0].is_active ? 'enabled' : 'disabled'} successfully`,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user status'
        });
    }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING *',
            [id, 'user']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
};
