import { query } from '../db/database.js';
import { hashPassword } from '../utils/passwordHelper.js';

/**
 * Submit application
 */
export const submitApplication = async (req, res) => {
    try {
        const {
            business_name,
            business_type,
            owner_name,
            email,
            phone,
            address,
            slug,
            password
        } = req.body;

        // Check if email already exists in applications or users
        const emailCheck = await query(
            'SELECT email FROM applications WHERE email = $1 UNION SELECT email FROM users WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Check if slug already exists
        const slugCheck = await query(
            'SELECT slug FROM applications WHERE slug = $1 UNION SELECT slug FROM users WHERE slug = $1',
            [slug]
        );

        if (slugCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Slug already taken. Please choose another.'
            });
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Insert application
        const result = await query(
            `INSERT INTO applications 
       (business_name, business_type, owner_name, email, phone, address, slug, password_hash, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') 
       RETURNING id, business_name, email, slug, status, created_at`,
            [business_name, business_type, owner_name, email, phone, address, slug, password_hash]
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! We will review it shortly.',
            application: result.rows[0]
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting application'
        });
    }
};
