import { body, validationResult } from 'express-validator';

/**
 * Validate email format
 */
export const validateEmail = body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format');

/**
 * Validate password strength
 */
export const validatePassword = body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long');

/**
 * Validate slug format (lowercase, alphanumeric, hyphens)
 */
export const validateSlug = body('slug')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens');

/**
 * Sanitize text input
 */
export const sanitizeText = (text) => {
    if (!text) return '';
    return text.trim().replace(/[<>]/g, '');
};

/**
 * Check validation results and return errors
 */
export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({
            success: false,
            message: errorMessages[0] || 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * Application validation rules
 */
export const applicationValidation = [
    body('business_name').notEmpty().trim().withMessage('Business name is required'),
    body('business_type').isIn(['Restaurant', 'Café']).withMessage('Invalid business type'),
    body('owner_name').notEmpty().trim().withMessage('Owner name is required'),
    validateEmail,
    body('phone').notEmpty().trim().withMessage('Phone number is required'),
    validateSlug,
    validatePassword,
    checkValidation
];

/**
 * Login validation rules
 * Supports both email (owners) and username (managers)
 */
export const loginValidation = [
    body('password').notEmpty().withMessage('Password is required'),
    // Email is optional (for owners) - only validate format if provided
    body('email')
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email format'),
    // Username is optional (for managers) - only validate if provided
    body('username')
        .optional({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Username cannot be empty'),
    // Custom validation to ensure either email or username is provided
    body().custom((value, { req }) => {
        const email = req.body.email;
        const username = req.body.username;
        const hasEmail = email !== undefined && email !== null && email !== '';
        const hasUsername = username !== undefined && username !== null && username !== '';
        
        if (!hasEmail && !hasUsername) {
            throw new Error('Either email or username is required');
        }
        
        return true;
    }),
    checkValidation
];
