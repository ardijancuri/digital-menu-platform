import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import {
    getApplications,
    approveApplication,
    rejectApplication,
    updateApplicationPayment,
    getUsers,
    toggleUserStatus,
    deleteUser
} from '../controllers/adminController.js';
import {
    getAdminMapListings,
    createMapListing,
    updateMapListing,
    deleteMapListing,
    getUnlinkedPlatformUsers
} from '../controllers/mapController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Application management
router.get('/applications', getApplications);
router.post('/applications/:id/approve', approveApplication);
router.post('/applications/:id/reject', rejectApplication);
router.put('/applications/:id/payment', updateApplicationPayment);

// User management
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Map listing management
router.get('/map-listings/unlinked-users', getUnlinkedPlatformUsers);
router.get('/map-listings', getAdminMapListings);
router.post('/map-listings', createMapListing);
router.put('/map-listings/:id', updateMapListing);
router.delete('/map-listings/:id', deleteMapListing);

export default router;
