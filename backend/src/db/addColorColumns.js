import pool from './database.js';

async function addColorColumns() {
    try {
        console.log('Adding new color columns to menu_settings table...');

        // Check if columns exist
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name IN ('category_bg_color', 'item_card_bg_color', 'border_color', 'header_bg_color')
        `;

        const existing = await pool.query(checkQuery);
        const existingColumns = existing.rows.map(r => r.column_name);

        // Add new columns if they don't exist
        if (!existingColumns.includes('category_bg_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN category_bg_color TEXT DEFAULT '#f9fafb'
            `);
            console.log('✅ Added category_bg_color column');
        }

        if (!existingColumns.includes('item_card_bg_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN item_card_bg_color TEXT DEFAULT '#ffffff'
            `);
            console.log('✅ Added item_card_bg_color column');
        }

        if (!existingColumns.includes('border_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN border_color TEXT DEFAULT '#e5e7eb'
            `);
            console.log('✅ Added border_color column');
        }

        if (!existingColumns.includes('header_bg_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN header_bg_color TEXT DEFAULT '#ffffff'
            `);
            console.log('✅ Added header_bg_color column');
        }

        console.log('✅ Color columns migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addColorColumns();
