import pool from '../db/database.js';
import bcrypt from 'bcryptjs';
import PDFDocument from 'pdfkit';

// Helper function to get effective user ID (owner_id for managers, id for owners)
const getEffectiveUserId = (user) => {
    return user.role === 'manager' && user.owner_id ? user.owner_id : user.id;
};

// --- Tables Management ---

export const getTables = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const result = await pool.query(
            `SELECT t.*, s.name as staff_name, o.id as order_id
             FROM tables t
             LEFT JOIN orders o ON t.id = o.table_id 
                AND o.user_id = $1 
                AND o.status IN ('pending', 'preparing')
             LEFT JOIN staff s ON o.staff_id = s.id
             WHERE t.user_id = $1 
             ORDER BY t.id ASC`,
            [userId]
        );
        res.json({ success: true, tables: result.rows });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createTable = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { name, capacity, position_x, position_y } = req.body;

        const result = await pool.query(
            'INSERT INTO tables (user_id, name, capacity, position_x, position_y) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, name, capacity || 4, position_x || 0, position_y || 0]
        );

        res.json({ success: true, table: result.rows[0] });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { id } = req.params;
        const { status } = req.body; // 'available', 'occupied', 'reserved'

        const result = await pool.query(
            'UPDATE tables SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        res.json({ success: true, table: result.rows[0] });
    } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM tables WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        res.json({ success: true, message: 'Table deleted successfully' });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- Staff Management ---

export const getStaff = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const result = await pool.query(
            'SELECT id, name, role, created_at FROM staff WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );

        // Calculate revenue for each staff member
        const staffWithRevenue = await Promise.all(
            result.rows.map(async (staff) => {
                const revenueResult = await pool.query(
                    `SELECT COALESCE(SUM(total_amount), 0) as revenue 
                     FROM orders 
                     WHERE user_id = $1 AND staff_id = $2`,
                    [userId, staff.id]
                );
                return {
                    ...staff,
                    revenue: parseFloat(revenueResult.rows[0].revenue || 0)
                };
            })
        );

        res.json({ success: true, staff: staffWithRevenue });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createStaff = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { name, pin_code, role } = req.body;

        // In a real app, hash the PIN. For simplicity here, we'll store it directly or simple hash if needed.
        // Let's use bcrypt for security best practice.
        const hashedPin = await bcrypt.hash(pin_code, 10);

        const result = await pool.query(
            'INSERT INTO staff (user_id, name, pin_code, role) VALUES ($1, $2, $3, $4) RETURNING id, name, role, created_at',
            [userId, name, hashedPin, role || 'server']
        );

        res.json({ success: true, staff: result.rows[0] });
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const loginStaff = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user); // Admin user ID (restaurant owner)
        const { pin_code } = req.body;

        // Find staff member by PIN (this is tricky because we hashed it).
        // Usually staff login is: Select User -> Enter PIN.
        // Or we need to iterate and check. 
        // Better approach: Pass staff_id and pin_code.

        // If we only have PIN, we might have collisions or need to check all.
        // Let's assume the UI sends staff_id + pin, OR we just check all staff for this user.

        // For "Fast Login" usually it's just a PIN pad.
        // Let's fetch all staff for this user and check PINs.

        const staffResult = await pool.query('SELECT * FROM staff WHERE user_id = $1', [userId]);

        let authenticatedStaff = null;

        for (const staff of staffResult.rows) {
            const match = await bcrypt.compare(pin_code, staff.pin_code);
            if (match) {
                authenticatedStaff = staff;
                break;
            }
        }

        if (authenticatedStaff) {
            res.json({
                success: true,
                staff: {
                    id: authenticatedStaff.id,
                    name: authenticatedStaff.name,
                    role: authenticatedStaff.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid PIN' });
        }

    } catch (error) {
        console.error('Error logging in staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyStaffPin = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { staff_id, pin_code } = req.body;

        if (!staff_id || !pin_code) {
            return res.status(400).json({ success: false, message: 'Staff ID and PIN are required' });
        }

        // Get the staff member
        const staffResult = await pool.query(
            'SELECT * FROM staff WHERE id = $1 AND user_id = $2',
            [staff_id, userId]
        );

        if (staffResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        const staff = staffResult.rows[0];
        const match = await bcrypt.compare(pin_code, staff.pin_code);

        if (match) {
            res.json({
                success: true,
                staff: {
                    id: staff.id,
                    name: staff.name,
                    role: staff.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid PIN' });
        }
    } catch (error) {
        console.error('Error verifying staff PIN:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM staff WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }

        res.json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// --- Orders Management ---

export const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = getEffectiveUserId(req.user);
        const { table_id, staff_id, items, payment_method, total_amount } = req.body;

        // 1. Create Order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, table_id, staff_id, status, total_amount, payment_method, payment_status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [userId, table_id, staff_id, 'preparing', total_amount, payment_method, 'pending']
        );

        const order = orderResult.rows[0];

        // 2. Add Order Items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [order.id, item.id, item.quantity, item.price, item.notes || '']
            );
        }

        // 3. Update Table Status if it's a table order
        if (table_id) {
            await client.query(
                'UPDATE tables SET status = $1 WHERE id = $2',
                ['occupied', table_id]
            );
        }

        await client.query('COMMIT');

        // Fetch complete order with items, table_name, and staff_name for receipt
        const completeOrderResult = await client.query(
            `SELECT o.*, t.name as table_name, s.name as staff_name,
                   json_agg(json_build_object(
                       'id', oi.id,
                       'menu_item_id', oi.menu_item_id,
                       'name', m.name,
                       'quantity', oi.quantity,
                       'price', oi.price,
                       'notes', oi.notes,
                       'created_at', oi.created_at
                   )) as items
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            LEFT JOIN staff s ON o.staff_id = s.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items m ON oi.menu_item_id = m.id
            WHERE o.id = $1
            GROUP BY o.id, t.name, s.name`,
            [order.id]
        );

        const completeOrder = completeOrderResult.rows[0];

        res.json({ success: true, order: completeOrder });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

export const addItemsToOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = getEffectiveUserId(req.user);
        const { order_id } = req.params;
        const { items } = req.body;

        // Verify order belongs to user
        const orderCheck = await client.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [order_id, userId]
        );

        if (orderCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Add new items to the order
        let additionalTotal = 0;
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [order_id, item.id, item.quantity, item.price, item.notes || '']
            );
            additionalTotal += parseFloat(item.price) * item.quantity;
        }

        // Update order total and set status back to preparing if it was ready
        await client.query(
            "UPDATE orders SET total_amount = total_amount + $1, status = 'preparing' WHERE id = $2",
            [additionalTotal, order_id]
        );

        await client.query('COMMIT');

        res.json({ success: true, message: 'Items added to order' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding items to order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);
        const { status } = req.query; // 'active' (pending/preparing/ready) or 'history' (completed/cancelled)

        let query = `
            SELECT o.*, t.name as table_name, s.name as staff_name,
                   json_agg(json_build_object(
                       'id', oi.id,
                       'menu_item_id', oi.menu_item_id,
                       'name', m.name,
                       'quantity', oi.quantity,
                       'price', oi.price,
                       'notes', oi.notes,
                       'created_at', oi.created_at
                   )) as items
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            LEFT JOIN staff s ON o.staff_id = s.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items m ON oi.menu_item_id = m.id
            WHERE o.user_id = $1
        `;

        const params = [userId];

        if (status === 'active') {
            query += ` AND o.status IN ('preparing')`;
        } else if (status === 'history') {
            query += ` AND o.status IN ('completed', 'cancelled')`;
        }

        query += ` GROUP BY o.id, t.name, s.name ORDER BY o.created_at DESC`;

        const result = await pool.query(query, params);
        res.json({ success: true, orders: result.rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateOrderTable = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = getEffectiveUserId(req.user);
        const { id } = req.params;
        const { table_id } = req.body;

        // Verify order belongs to user
        const orderCheck = await client.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (orderCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orderCheck.rows[0];
        const oldTableId = order.table_id;

        // Update order's table_id
        await client.query(
            'UPDATE orders SET updated_at = NOW(), table_id = $1 WHERE id = $2',
            [table_id || null, id]
        );

        // Handle old table: free it if no other active orders
        if (oldTableId) {
            const activeOrdersRes = await client.query(
                `SELECT id FROM orders WHERE table_id = $1 AND status IN ('pending', 'preparing') AND id != $2`,
                [oldTableId, id]
            );

            if (activeOrdersRes.rows.length === 0) {
                await client.query(
                    'UPDATE tables SET status = $1 WHERE id = $2',
                    ['available', oldTableId]
                );
            }
        }

        // Handle new table: occupy it if order is active
        if (table_id && order.status === 'preparing') {
            await client.query(
                'UPDATE tables SET status = $1 WHERE id = $2',
                ['occupied', table_id]
            );
        }

        await client.query('COMMIT');

        res.json({ success: true, message: 'Order table updated' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating order table:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

export const updateOrderStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = getEffectiveUserId(req.user);
        const { id } = req.params;
        const { status, payment_status } = req.body;

        // If status is cancelled, DELETE the order instead of updating
        if (status === 'cancelled') {
            const deleteQuery = 'DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING *';
            const result = await client.query(deleteQuery, [id, userId]);

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            // Also update table status to 'available' if it was occupied by this order
            const deletedOrder = result.rows[0];
            if (deletedOrder.table_id) {
                const activeOrdersRes = await client.query(
                    `SELECT id FROM orders WHERE table_id = $1 AND status IN ('pending', 'preparing') AND id != $2`,
                    [deletedOrder.table_id, id]
                );

                if (activeOrdersRes.rows.length === 0) {
                    await client.query(
                        'UPDATE tables SET status = $1 WHERE id = $2',
                        ['available', deletedOrder.table_id]
                    );
                }
            }

            await client.query('COMMIT');
            return res.json({ success: true, message: 'Order cancelled and deleted', deleted: true });
        }

        let updateQuery = 'UPDATE orders SET updated_at = NOW()';
        const params = [];
        let paramCount = 1;

        if (status) {
            updateQuery += `, status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (payment_status) {
            updateQuery += `, payment_status = $${paramCount}`;
            params.push(payment_status);
            paramCount++;
        }

        updateQuery += ` WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
        params.push(id, userId);

        const result = await client.query(updateQuery, params);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = result.rows[0];

        // If order is completed or cancelled, free up the table
        if ((status === 'completed' || status === 'cancelled') && order.table_id) {
            await client.query(
                'UPDATE tables SET status = $1 WHERE id = $2',
                ['available', order.table_id]
            );
        }

        // If order is being reactivated (status changed to 'preparing' from completed/cancelled), occupy the table
        if (status === 'preparing' && order.table_id) {
            await client.query(
                'UPDATE tables SET status = $1 WHERE id = $2',
                ['occupied', order.table_id]
            );
        }

        await client.query('COMMIT');

        res.json({ success: true, order });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

// --- Staff Revenue Management ---

/**
 * Get staff revenue breakdown
 */
export const getStaffRevenue = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);

        // Get all staff
        const staffResult = await pool.query(
            'SELECT id, name FROM staff WHERE user_id = $1',
            [userId]
        );

        // Calculate revenue for each staff member
        const staffRevenue = await Promise.all(
            staffResult.rows.map(async (staff) => {
                const revenueResult = await pool.query(
                    `SELECT COALESCE(SUM(total_amount), 0) as revenue 
                     FROM orders 
                     WHERE user_id = $1 AND staff_id = $2`,
                    [userId, staff.id]
                );
                return {
                    staff_id: staff.id,
                    staff_name: staff.name,
                    revenue: parseFloat(revenueResult.rows[0].revenue || 0)
                };
            })
        );

        // Calculate total revenue
        const totalRevenue = staffRevenue.reduce((sum, item) => sum + item.revenue, 0);

        res.json({
            success: true,
            staffRevenue,
            totalRevenue
        });
    } catch (error) {
        console.error('Error fetching staff revenue:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Reset staff revenue - Store today's revenue and delete today's orders
 * Generates PDF report of all today's orders
 */
export const resetStaffRevenue = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userId = getEffectiveUserId(req.user);

        // Get today's date for daily_revenue table storage
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Format date as YYYY-MM-DD in local timezone (not UTC)
        const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Get ALL orders for PDF report (with table and staff info) - no date filter
        const allOrdersResult = await client.query(
            `SELECT o.id, o.total_amount, o.status, o.created_at, o.payment_method, o.payment_status,
                    t.name as table_name, s.name as staff_name
             FROM orders o
             LEFT JOIN tables t ON o.table_id = t.id
             LEFT JOIN staff s ON o.staff_id = s.id
             WHERE o.user_id = $1 
             ORDER BY o.created_at ASC`,
            [userId]
        );

        const allOrders = allOrdersResult.rows;

        // Get all orders for revenue calculation - no date filter
        const ordersResult = await client.query(
            `SELECT id, staff_id, total_amount 
             FROM orders 
             WHERE user_id = $1`,
            [userId]
        );

        const allOrdersForRevenue = ordersResult.rows;

        // Calculate total revenue from all orders
        const totalRevenue = allOrdersForRevenue.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        // Calculate revenue per staff member
        const staffRevenueMap = {};
        allOrdersForRevenue.forEach(order => {
            if (order.staff_id) {
                if (!staffRevenueMap[order.staff_id]) {
                    staffRevenueMap[order.staff_id] = 0;
                }
                staffRevenueMap[order.staff_id] += parseFloat(order.total_amount || 0);
            }
        });

        // Get staff names for the breakdown
        const staffIds = Object.keys(staffRevenueMap).map(id => parseInt(id));
        let staffNames = {};
        if (staffIds.length > 0) {
            const staffResult = await client.query(
                `SELECT id, name FROM staff WHERE id = ANY($1::int[])`,
                [staffIds]
            );
            staffResult.rows.forEach(staff => {
                staffNames[staff.id] = staff.name;
            });
        }

        // Build staff_revenue JSONB object
        const staffRevenueJson = {};
        Object.keys(staffRevenueMap).forEach(staffId => {
            staffRevenueJson[staffId] = {
                name: staffNames[parseInt(staffId)] || 'Unknown',
                revenue: staffRevenueMap[staffId]
            };
        });

        // Get business name for PDF
        const userResult = await client.query(
            'SELECT business_name FROM users WHERE id = $1',
            [userId]
        );
        const businessName = userResult.rows[0]?.business_name || 'Restaurant';

        // Get existing daily_revenue if it exists (before generating PDF so we can include merged data)
        const existingRevenueResult = await client.query(
            'SELECT total_revenue, order_count, staff_revenue FROM daily_revenue WHERE user_id = $1 AND date = $2',
            [userId, todayDateStr]
        );

        let finalTotalRevenue = totalRevenue;
        let finalOrderCount = allOrdersForRevenue.length;
        let finalStaffRevenue = { ...staffRevenueJson };

        if (existingRevenueResult.rows.length > 0) {
            const existing = existingRevenueResult.rows[0];
            // Add to existing values
            finalTotalRevenue = parseFloat(existing.total_revenue || 0) + totalRevenue;
            finalOrderCount = (existing.order_count || 0) + allOrdersForRevenue.length;
            
            // Merge staff revenue - add revenue for each staff member
            const existingStaffRevenue = existing.staff_revenue || {};
            finalStaffRevenue = { ...existingStaffRevenue };
            
            Object.keys(staffRevenueJson).forEach(staffId => {
                if (finalStaffRevenue[staffId]) {
                    finalStaffRevenue[staffId].revenue = parseFloat(finalStaffRevenue[staffId].revenue || 0) + staffRevenueJson[staffId].revenue;
                } else {
                    finalStaffRevenue[staffId] = staffRevenueJson[staffId];
                }
            });
        }

        // Generate PDF report in receipt format (80mm width)
        const receiptWidth = 226.77; // 80mm in points (72 DPI)
        const doc = new PDFDocument({ 
            size: [receiptWidth, 1000], // Width fixed at 80mm, height will auto-extend
            margin: 16 
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('error', async (error) => {
            await client.query('ROLLBACK');
            console.error('Error generating PDF:', error);
            res.status(500).json({ success: false, message: 'Error generating PDF' });
            client.release();
        });
        doc.on('end', async () => {
            try {
                const pdfBuffer = Buffer.concat(chunks);

                // Store in daily_revenue table (use ON CONFLICT to add to existing if exists)

                await client.query(
                    `INSERT INTO daily_revenue (user_id, date, total_revenue, order_count, staff_revenue)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (user_id, date) 
                     DO UPDATE SET 
                         total_revenue = EXCLUDED.total_revenue,
                         order_count = EXCLUDED.order_count,
                         staff_revenue = EXCLUDED.staff_revenue`,
                    [userId, todayDateStr, finalTotalRevenue, finalOrderCount, JSON.stringify(finalStaffRevenue)]
                );

                // Delete all orders
                if (allOrdersForRevenue.length > 0) {
                    const orderIds = allOrdersForRevenue.map(order => order.id);
                    
                    // Delete order items first (cascade should handle this, but being explicit)
                    await client.query(
                        `DELETE FROM order_items WHERE order_id = ANY($1::int[])`,
                        [orderIds]
                    );

                    // Delete orders
                    await client.query(
                        `DELETE FROM orders WHERE id = ANY($1::int[])`,
                        [orderIds]
                    );
                }

                // Set all tables to available status
                await client.query(
                    'UPDATE tables SET status = $1 WHERE user_id = $2',
                    ['available', userId]
                );

                await client.query('COMMIT');

                // Send PDF response
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="orders-report-${todayDateStr}.pdf"`);
                res.send(pdfBuffer);
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error in PDF generation callback:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            } finally {
                client.release();
            }
        });

        // PDF Content - Receipt Format
        const pageWidth = receiptWidth - 32; // Account for margins
        const leftMargin = 16;
        
        // Header
        doc.fontSize(16).font('Helvetica-Bold').text('ORDERS REPORT', leftMargin, 16, { align: 'center', width: pageWidth });
        doc.fontSize(12).font('Helvetica').text(businessName, leftMargin, doc.y + 4, { align: 'center', width: pageWidth });
        doc.fontSize(9).text(new Date().toLocaleDateString(), leftMargin, doc.y + 4, { align: 'center', width: pageWidth });
        
        doc.moveDown(1);
        doc.moveTo(leftMargin, doc.y).lineTo(pageWidth + leftMargin, doc.y).stroke();
        doc.moveDown(0.5);

        // Summary
        doc.fontSize(10).font('Helvetica-Bold').text('SUMMARY', leftMargin, doc.y);
        doc.fontSize(9).font('Helvetica');
        doc.text(`Total Orders: ${finalOrderCount}`, leftMargin, doc.y + 2);
        doc.text(`Total Revenue: ${Math.round(finalTotalRevenue).toLocaleString()} MKD`, leftMargin, doc.y + 2);
        doc.moveDown(0.5);
        doc.moveTo(leftMargin, doc.y).lineTo(pageWidth + leftMargin, doc.y).stroke();
        doc.moveDown(0.5);

        // Staff Revenue Breakdown
        doc.fontSize(10).font('Helvetica-Bold').text('STAFF REVENUE', leftMargin, doc.y);
        doc.moveDown(0.3);

        // Get staff members with revenue > 0 and sort by revenue descending
        const staffWithRevenue = Object.keys(finalStaffRevenue)
            .map(staffId => ({
                id: staffId,
                name: finalStaffRevenue[staffId].name || 'Unknown',
                revenue: parseFloat(finalStaffRevenue[staffId].revenue || 0)
            }))
            .filter(staff => staff.revenue > 0)
            .sort((a, b) => b.revenue - a.revenue);

        if (staffWithRevenue.length > 0) {
            doc.fontSize(8).font('Helvetica-Bold');
            staffWithRevenue.forEach(staff => {
                if (doc.y > 950) {
                    doc.addPage({ size: [receiptWidth, 1000], margin: 16 });
                }
                const currentY = doc.y;
                const staffName = staff.name.length > 20 ? staff.name.substring(0, 20) + '...' : staff.name;
                const amount = `${Math.round(staff.revenue).toLocaleString()} MKD`;
                doc.text(staffName, leftMargin, currentY);
                doc.text(amount, leftMargin, currentY, { align: 'right', width: pageWidth });
                doc.moveDown(0.3);
            });
        } else {
            doc.fontSize(8).font('Helvetica').text('No staff revenue data', leftMargin, doc.y);
        }

        doc.moveDown(0.5);
        doc.moveTo(leftMargin, doc.y).lineTo(pageWidth + leftMargin, doc.y).stroke();
        doc.moveDown(0.5);

        // Orders Table - Only Staff and Amount columns
        doc.fontSize(10).font('Helvetica-Bold').text('ORDERS', leftMargin, doc.y);
        doc.moveDown(0.3);

        // Table rows
        doc.font('Helvetica').fontSize(8);
        allOrders.forEach((order) => {
            if (doc.y > 950) {
                doc.addPage({ size: [receiptWidth, 1000], margin: 16 });
            }

            const currentY = doc.y;
            const staffName = (order.staff_name || 'N/A');
            const staffDisplay = staffName.length > 25 ? staffName.substring(0, 25) + '...' : staffName;
            const amount = `${Math.round(parseFloat(order.total_amount || 0)).toLocaleString()} MKD`;

            doc.text(staffDisplay, leftMargin, currentY);
            doc.text(amount, leftMargin, currentY, { align: 'right', width: pageWidth });
            doc.moveDown(0.3);
        });


        doc.end();
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error resetting staff revenue:', error);
        res.status(500).json({ success: false, message: 'Server error' });
        client.release();
    }
};

/**
 * Get daily revenue records
 */
export const getDailyRevenue = async (req, res) => {
    try {
        const userId = getEffectiveUserId(req.user);

        const result = await pool.query(
            `SELECT id, date::text as date, total_revenue, order_count, staff_revenue, created_at
             FROM daily_revenue
             WHERE user_id = $1
             ORDER BY date DESC
             LIMIT 100`,
            [userId]
        );

        res.json({
            success: true,
            dailyRevenue: result.rows
        });
    } catch (error) {
        console.error('Error fetching daily revenue:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
