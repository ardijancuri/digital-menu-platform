import pool from './database.js';

async function addFontColumns() {
    try {
        console.log('Adding font columns to menu_settings table...');

        // Check if columns already exist
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name IN ('heading_font', 'body_font')
        `;

        const existing = await pool.query(checkQuery);

        if (existing.rows.length === 2) {
            console.log('✅ Font columns already exist');
            return;
        }

        // Add heading_font column if it doesn't exist
        if (!existing.rows.find(r => r.column_name === 'heading_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN heading_font TEXT DEFAULT 'Playfair Display'
            `);
            console.log('✅ Added heading_font column');
        }

        // Add body_font column if it doesn't exist
        if (!existing.rows.find(r => r.column_name === 'body_font')) {
            await pool.query(`
                ALTER TABLE menu_settings 
                ADD COLUMN body_font TEXT DEFAULT 'Poppins'
            `);
            console.log('✅ Added body_font column');
        }

        console.log('✅ Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addFontColumns();
