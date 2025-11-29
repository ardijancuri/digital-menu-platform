-- Seed data for Digital Menu Platform
-- This creates the default admin account

-- Insert admin user
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO users (business_name, email, slug, password_hash, role) 
VALUES (
    'Platform Admin',
    'admin@menuplatform.com',
    'admin',
    '$2b$10$rZ5YhqKX4qvKJ8YhqKX4qO7YhqKX4qvKJ8YhqKX4qvKJ8YhqKX4qO',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Note: The password hash above is a placeholder
-- You'll need to generate the actual hash by running:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('Admin123!', 10);
-- console.log(hash);

SELECT 'Admin user seeded successfully!' AS message;
SELECT 'Email: admin@menuplatform.com' AS credentials;
SELECT 'Password: Admin123!' AS password;
