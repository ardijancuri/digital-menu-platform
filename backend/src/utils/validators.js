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
        return res.status(400).json({
            success: false,
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
 */
export const loginValidation = [
    validateEmail,
    body('password').notEmpty().withMessage('Password is required'),
    checkValidation
];
