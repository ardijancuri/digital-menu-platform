import { query } from '../db/database.js';
import { comparePassword } from '../utils/passwordHelper.js';
import { generateToken } from '../utils/jwtHelper.js';

/**
 * Admin login
 */
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND role = $2',
            [email, 'admin']
        );

        if (result.rows.length === 0) {
            console.log('Admin login failed: No user found or not admin for email:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or not an admin account'
            });
        }

        const user = result.rows[0];

        // DEBUG: Temporary logging
        console.log('User found:', user.email);
        console.log('Stored hash length:', user.password_hash?.length);
        console.log('Input password length:', password?.length);
        console.log('Stored hash (first 10 chars):', user.password_hash?.substring(0, 10));

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            // Double check if trim helps
            const trimmedValid = await comparePassword(password.trim(), user.password_hash.trim());
            console.log('Trimmed password comparison result:', trimmedValid);

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            slug: user.slug
        });

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                business_name: user.business_name,
                role: user.role,
                slug: user.slug
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * User (restaurant owner) login
 */
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND role = $2',
            [email, 'user']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been disabled. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            slug: user.slug
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                business_name: user.business_name,
                role: user.role,
                slug: user.slug
            }
        });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};
