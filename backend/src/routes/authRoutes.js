import express from 'express';
import { adminLogin, userLogin } from '../controllers/authController.js';
import { loginValidation } from '../utils/validators.js';

const router = express.Router();

// Admin login
router.post('/admin-login', loginValidation, adminLogin);

// User login
router.post('/user-login', loginValidation, userLogin);

export default router;
