import pool from './database.js';

async function removeAddressColumn() {
    try {
        console.log('Checking for address column on applications table...');

        const checkQuery = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'applications'
            AND column_name = 'address'
        `;

        const existing = await pool.query(checkQuery);
        const hasColumn = existing.rows.length > 0;

        if (!hasColumn) {
            console.log('✅ address column already removed');
            process.exit(0);
        }

        console.log('Removing address column from applications table...');
        await pool.query('ALTER TABLE applications DROP COLUMN address');
        console.log('✅ address column removed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to remove address column:', error);
        process.exit(1);
    }
}

removeAddressColumn();

