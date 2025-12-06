import pool from './database.js';

async function createPosTables() {
    try {
        console.log('Creating POS tables...');

        // Create tables table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tables (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                capacity INTEGER DEFAULT 4,
                status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
                position_x INTEGER DEFAULT 0,
                position_y INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Created tables table');

        // Create staff table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS staff (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                role TEXT DEFAULT 'server' CHECK (role IN ('admin', 'manager', 'server', 'kitchen')),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Created staff table');

        // Create orders table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
                staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
                total_amount NUMERIC(10, 2) DEFAULT 0.00,
                payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online', NULL)),
                payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Created orders table');

        // Create order_items table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
                quantity INTEGER DEFAULT 1,
                price NUMERIC(10, 2) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Created order_items table');

        // Create indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_tables_user_id ON tables(user_id);
            CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
            CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
            CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        `);
        console.log('✅ Created indexes');

        console.log('✅ POS tables migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

createPosTables();
