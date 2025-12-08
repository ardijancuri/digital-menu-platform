import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars first
dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    // Dynamic import to ensure env vars are loaded first
    const { query } = await import('./src/db/database.js');

    try {
        const migrationPath = path.join(__dirname, 'src', 'db', 'migration_product_images.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running migration...');
        await query(sql);
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

run();
