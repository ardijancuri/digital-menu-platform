import express from 'express';
import { getPublicMenu } from '../controllers/publicController.js';

const router = express.Router();

// Get public menu by slug
router.get('/menu/:slug', getPublicMenu);

export default router;
