import pool from '../db/database.js';
import bcrypt from 'bcryptjs';

// --- Tables Management ---

export const getTables = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT t.*, s.name as staff_name, o.id as order_id
             FROM tables t
             LEFT JOIN orders o ON t.id = o.table_id 
                AND o.user_id = $1 
                AND o.status IN ('pending', 'preparing', 'ready')
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
        const userId = req.user.id;
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
        const userId = req.user.id;
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
        const userId = req.user.id;
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
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, name, role, created_at FROM staff WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );
        res.json({ success: true, staff: result.rows });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createStaff = async (req, res) => {
    try {
        const userId = req.user.id;
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
        const userId = req.user.id; // Admin user ID (restaurant owner)
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
        const userId = req.user.id;
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
        const userId = req.user.id;
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

        const userId = req.user.id;
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

        res.json({ success: true, order });
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

        const userId = req.user.id;
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
        const userId = req.user.id;
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
        } else if (status === 'ready') {
            query += ` AND o.status = 'ready'`;
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

export const updateOrderStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = req.user.id;
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
                    `SELECT id FROM orders WHERE table_id = $1 AND status IN ('pending', 'preparing', 'ready') AND id != $2`,
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
