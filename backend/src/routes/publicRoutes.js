import express from 'express';
import { getPublicMenu } from '../controllers/publicController.js';
import { getMapListings } from '../controllers/mapController.js';

const router = express.Router();

// Get public menu by slug
router.get('/menu/:slug', getPublicMenu);

// Map listings (public, no auth)
router.get('/map-listings', getMapListings);

export default router;
