import pool from './database.js';
import bcrypt from 'bcryptjs';

async function createTestMenu() {
    try {
        console.log('Creating test restaurant menu...');

        // Create test user
        const passwordHash = await bcrypt.hash('test123', 10);
        const userResult = await pool.query(`
            INSERT INTO users (business_name, email, slug, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO UPDATE 
            SET slug = EXCLUDED.slug
            RETURNING id
        `, ['Test Restaurant', 'test@restaurant.com', 'test', passwordHash, 'user']);

        const userId = userResult.rows[0].id;
        console.log(`✅ Created user with ID: ${userId}`);

        // Create menu settings
        const existingSettings = await pool.query(
            'SELECT id FROM menu_settings WHERE user_id = $1',
            [userId]
        );

        if (existingSettings.rows.length === 0) {
            await pool.query(`
                INSERT INTO menu_settings (
                    user_id, 
                    primary_color, 
                    background_color, 
                    text_color, 
                    accent_color,
                    heading_font,
                    body_font,
                    description,
                    opening_hours
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
                userId,
                '#6366f1',
                '#ffffff',
                '#111827',
                '#8b5cf6',
                'Playfair Display',
                'Poppins',
                'Welcome to our restaurant! Enjoy fresh, delicious meals.',
                'Mon-Fri: 11:00 AM - 10:00 PM, Sat-Sun: 10:00 AM - 11:00 PM'
            ]);
        } else {
            await pool.query(`
                UPDATE menu_settings
                SET primary_color = $2,
                    background_color = $3,
                    text_color = $4,
                    accent_color = $5,
                    heading_font = $6,
                    body_font = $7,
                    description = $8,
                    opening_hours = $9
                WHERE user_id = $1
            `, [
                userId,
                '#6366f1',
                '#ffffff',
                '#111827',
                '#8b5cf6',
                'Playfair Display',
                'Poppins',
                'Welcome to our restaurant! Enjoy fresh, delicious meals.',
                'Mon-Fri: 11:00 AM - 10:00 PM, Sat-Sun: 10:00 AM - 11:00 PM'
            ]);
        }
        console.log('✅ Created menu settings');

        // Create categories
        const appetizersResult = await pool.query(`
            INSERT INTO categories (user_id, name, position)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
            RETURNING id
        `, [userId, 'Appetizers', 1]);

        const mainsResult = await pool.query(`
            INSERT INTO categories (user_id, name, position)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
            RETURNING id
        `, [userId, 'Main Courses', 2]);

        const dessertsResult = await pool.query(`
            INSERT INTO categories (user_id, name, position)
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
            RETURNING id
        `, [userId, 'Desserts', 3]);

        console.log('✅ Created categories');

        // Get category IDs
        const categoriesResult = await pool.query(
            'SELECT id, name FROM categories WHERE user_id = $1 ORDER BY position',
            [userId]
        );

        const categories = categoriesResult.rows;
        const appetizersId = categories.find(c => c.name === 'Appetizers')?.id;
        const mainsId = categories.find(c => c.name === 'Main Courses')?.id;
        const dessertsId = categories.find(c => c.name === 'Desserts')?.id;

        // Create menu items
        if (appetizersId) {
            await pool.query(`
                INSERT INTO menu_items (category_id, name, description, price, tag)
                VALUES 
                    ($1, 'Bruschetta', 'Toasted bread with fresh tomatoes, garlic, and basil', 8.99, 'New'),
                    ($1, 'Mozzarella Sticks', 'Crispy fried mozzarella with marinara sauce', 7.99, NULL),
                    ($1, 'Caesar Salad', 'Fresh romaine lettuce with parmesan and croutons', 9.99, 'Bestseller')
                ON CONFLICT DO NOTHING
            `, [appetizersId]);
        }

        if (mainsId) {
            await pool.query(`
                INSERT INTO menu_items (category_id, name, description, price, tag)
                VALUES 
                    ($1, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce', 24.99, 'Hot'),
                    ($1, 'Ribeye Steak', 'Premium 12oz ribeye with garlic mashed potatoes', 32.99, 'Bestseller'),
                    ($1, 'Pasta Carbonara', 'Classic Italian pasta with bacon and parmesan', 18.99, NULL),
                    ($1, 'Chicken Parmesan', 'Breaded chicken breast with marinara and mozzarella', 19.99, NULL)
                ON CONFLICT DO NOTHING
            `, [mainsId]);
        }

        if (dessertsId) {
            await pool.query(`
                INSERT INTO menu_items (category_id, name, description, price, tag)
                VALUES 
                    ($1, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, 'Bestseller'),
                    ($1, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 9.99, 'Hot'),
                    ($1, 'Cheesecake', 'New York style cheesecake with berry compote', 7.99, NULL)
                ON CONFLICT DO NOTHING
            `, [dessertsId]);
        }

        console.log('✅ Created menu items');
        console.log('\n🎉 Test menu created successfully!');
        console.log('📍 View at: http://localhost:5173/menu/test');
        console.log('🔑 Login: test@restaurant.com / test123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test menu:', error);
        process.exit(1);
    }
}

createTestMenu();
