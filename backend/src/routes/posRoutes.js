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
    deleteStaff,
    createOrder,
    addItemsToOrder,
    getOrders,
    updateOrderStatus
} from '../controllers/posController.js';

const router = express.Router();

// All routes require authentication (restaurant owner login)
router.use(authenticateToken);

// Tables
router.get('/tables', getTables);
router.post('/tables', createTable);
router.put('/tables/:id/status', updateTableStatus);
router.delete('/tables/:id', deleteTable);

// Staff
router.get('/staff', getStaff);
router.post('/staff', createStaff);
router.post('/staff/login', loginStaff);
router.delete('/staff/:id', deleteStaff);

// Orders
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.post('/orders/:order_id/items', addItemsToOrder);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
