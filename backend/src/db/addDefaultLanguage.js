import pool from './database.js';

async function addDefaultLanguage() {
    try {
        console.log('Adding default_language column to menu_settings table...');

        // Check if column exists
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'menu_settings' 
            AND column_name = 'default_language'
        `;

        const existing = await pool.query(checkQuery);

        if (existing.rows.length > 0) {
            console.log('✅ default_language column already exists');
            return;
        }

        // Add default_language column
        await pool.query(`
            ALTER TABLE menu_settings 
            ADD COLUMN default_language TEXT DEFAULT 'en'
        `);
        console.log('✅ Added default_language column');

        console.log('✅ Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addDefaultLanguage();

