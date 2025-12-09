import pool from './database.js';

async function addBreaklineColor() {
    try {
        console.log('Adding breakline_color column to menu_settings (if missing)...');

        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name = 'breakline_color'
        `;

        const existing = await pool.query(checkQuery);
        const hasColumn = existing.rows.length > 0;

        if (hasColumn) {
            console.log('✅ breakline_color already exists');
            process.exit(0);
        }

        await pool.query(`
            ALTER TABLE menu_settings 
            ADD COLUMN breakline_color TEXT DEFAULT '#e5e7eb'
        `);

        console.log('✅ Added breakline_color column with default #e5e7eb');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addBreaklineColor();

