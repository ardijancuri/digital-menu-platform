import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/uploadMiddleware.js';
import {
    getSettings,
    updateSettings,
    uploadLogo,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    uploadItemImage
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/upload-logo', uploadSingle('logo'), uploadLogo);

// Category routes
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Menu item routes
router.get('/menu-items', getMenuItems);
router.post('/menu-items', createMenuItem);
router.put('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);
router.post('/upload-item-image', uploadSingle('image'), uploadItemImage);

export default router;
