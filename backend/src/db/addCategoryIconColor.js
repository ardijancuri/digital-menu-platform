import pool from './database.js';

async function addCategoryIconColor() {
    try {
        console.log('Adding category_icon_color column to menu_settings table...');

        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name = 'category_icon_color'
        `;

        const existing = await pool.query(checkQuery);

        if (existing.rows.length === 0) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN category_icon_color TEXT DEFAULT '#3b82f6'
            `);
            console.log('✅ Added category_icon_color column');
        } else {
            console.log('ℹ️  category_icon_color column already exists');
        }

        console.log('✅ Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addCategoryIconColor();
