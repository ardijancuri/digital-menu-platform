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
    getStaffReport,
    getDailyRevenue
} from '../controllers/posController.js';

const router = express.Router();

// All routes require authentication (restaurant owner login)
router.use(authenticateToken);


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

// Staff
router.get('/staff', getStaff);
router.post('/staff', createStaff);
router.post('/staff/login', loginStaff);
router.post('/staff/verify-pin', verifyStaffPin);
router.get('/staff/:id/report', getStaffReport); // Must be before /staff/:id to avoid route conflicts
router.delete('/staff/:id', deleteStaff);
router.get('/staff/revenue', getStaffRevenue);
router.post('/staff/reset-revenue', resetStaffRevenue);

// Orders
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.post('/orders/:order_id/items', addItemsToOrder);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/table', updateOrderTable);

// Reports
router.get('/reports/daily-revenue', getDailyRevenue);

export default router;
