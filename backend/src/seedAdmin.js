import bcrypt from 'bcryptjs';
import { query } from './db/database.js';

const seedAdmin = async () => {
    try {
        console.log('🌱 Seeding admin account...');

        // Hash the admin password
        const password = 'Admin123!';
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert admin user
        await query(
            `INSERT INTO users (business_name, email, slug, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash`,
            ['Platform Admin', 'admin@menuplatform.com', 'admin', passwordHash, 'admin']
        );

        console.log('✅ Admin account created successfully!');
        console.log('📧 Email: admin@menuplatform.com');
        console.log('🔑 Password: Admin123!');
        console.log('');
        console.log('⚠️  Please change these credentials in production!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
