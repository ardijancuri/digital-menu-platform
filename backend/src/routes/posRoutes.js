import express from 'express';
import { authMiddleware as authenticateToken } from '../middlewares/authMiddleware.js';
import {
    getTables,
    createTable,
    updateTableStatus,
    deleteTable,
    getStaff,
    createStaff,
    loginStaff,
    verifyStaffPin,
    deleteStaff,
    createOrder,
    addItemsToOrder,
    getOrders,
    updateOrderStatus,
    updateOrderTable,
    getStaffRevenue,
    resetStaffRevenue,
    getDailyRevenue
} from '../controllers/posController.js';

const router = express.Router();

// All routes require authentication (restaurant owner login)
router.use(authenticateToken);

// Middleware to block managers from staff routes
const blockManagersFromStaff = (req, res, next) => {
    if (req.user.role === 'manager') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Managers cannot access staff management.'
        });
    }
    next();
};

// Middleware to block managers from deleting tables
const blockManagersFromTableDeletion = (req, res, next) => {
    if (req.user.role === 'manager') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only owners can delete tables.'
        });
    }
    next();
};

// Middleware to block managers from creating tables
const blockManagersFromTableCreation = (req, res, next) => {
    if (req.user.role === 'manager') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Only owners can create tables.'
        });
    }
    next();
};

// Tables
router.get('/tables', getTables);
// Block managers from creating tables
router.post('/tables', blockManagersFromTableCreation, createTable);
router.put('/tables/:id/status', updateTableStatus);
// Block managers from deleting tables
router.delete('/tables/:id', blockManagersFromTableDeletion, deleteTable);

// Staff - Block managers from accessing
router.get('/staff', blockManagersFromStaff, getStaff);
router.post('/staff', blockManagersFromStaff, createStaff);
router.post('/staff/login', loginStaff);
router.post('/staff/verify-pin', verifyStaffPin);
router.delete('/staff/:id', blockManagersFromStaff, deleteStaff);
router.get('/staff/revenue', blockManagersFromStaff, getStaffRevenue);
router.post('/staff/reset-revenue', blockManagersFromStaff, resetStaffRevenue);

// Orders
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.post('/orders/:order_id/items', addItemsToOrder);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/table', updateOrderTable);

// Reports - Block managers from accessing
router.get('/reports/daily-revenue', blockManagersFromStaff, getDailyRevenue);

export default router;
