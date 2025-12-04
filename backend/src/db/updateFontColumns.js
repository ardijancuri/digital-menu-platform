import pool from './database.js';

async function updateFontColumns() {
    try {
        console.log('Updating font columns in menu_settings table...');

        // Check if old columns exist
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name IN ('heading_font', 'body_font', 'business_name_font', 'category_font', 'product_name_font', 'description_font')
        `;

        const existing = await pool.query(checkQuery);
        const existingColumns = existing.rows.map(r => r.column_name);

        // Remove old columns if they exist
        if (existingColumns.includes('heading_font')) {
            await pool.query('ALTER TABLE menu_settings DROP COLUMN heading_font');
            console.log('✅ Removed heading_font column');
        }

        if (existingColumns.includes('body_font')) {
            await pool.query('ALTER TABLE menu_settings DROP COLUMN body_font');
            console.log('✅ Removed body_font column');
        }

        // Add new columns if they don't exist
        if (!existingColumns.includes('business_name_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN business_name_font TEXT DEFAULT 'Montserrat'
            `);
            console.log('✅ Added business_name_font column');
        }

        if (!existingColumns.includes('category_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN category_font TEXT DEFAULT 'Roboto Condensed'
            `);
            console.log('✅ Added category_font column');
        }

        if (!existingColumns.includes('product_name_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN product_name_font TEXT DEFAULT 'Montserrat'
            `);
            console.log('✅ Added product_name_font column');
        }

        if (!existingColumns.includes('description_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN description_font TEXT DEFAULT 'Quicksand'
            `);
            console.log('✅ Added description_font column');
        }

        console.log('✅ Font columns migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

updateFontColumns();
