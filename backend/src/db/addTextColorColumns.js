import pool from './database.js';

async function addTextColorColumns() {
    try {
        console.log('Adding text color columns to menu_settings table...');

        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name IN ('category_title_color', 'product_name_color', 'description_text_color', 'price_color')
        `;

        const existing = await pool.query(checkQuery);
        const existingColumns = existing.rows.map(r => r.column_name);

        if (!existingColumns.includes('category_title_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN category_title_color TEXT DEFAULT '#1f2937'
            `);
            console.log('✅ Added category_title_color column');
        }

        if (!existingColumns.includes('product_name_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN product_name_color TEXT DEFAULT '#1f2937'
            `);
            console.log('✅ Added product_name_color column');
        }

        if (!existingColumns.includes('description_text_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN description_text_color TEXT DEFAULT '#6b7280'
            `);
            console.log('✅ Added description_text_color column');
        }

        if (!existingColumns.includes('price_color')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN price_color TEXT DEFAULT '#3b82f6'
            `);
            console.log('✅ Added price_color column');
        }

        console.log('✅ Text color columns migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addTextColorColumns();
