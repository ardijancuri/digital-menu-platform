-- Migration script to add manager user support
-- Run this script on your existing database to add manager functionality

-- Step 1: Drop the existing CHECK constraint on role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Step 2: Add new columns (owner_id and username)
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS owner_id INTEGER,
    ADD COLUMN IF NOT EXISTS username TEXT;

-- Step 3: Make email nullable (managers don't have email)
ALTER TABLE users 
    ALTER COLUMN email DROP NOT NULL;

-- Step 4: Add the updated CHECK constraint with 'manager' role
ALTER TABLE users 
    ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'manager'));

-- Step 5: Add foreign key constraint for owner_id
ALTER TABLE users 
    ADD CONSTRAINT users_owner_id_fkey 
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 6: Add unique constraint on username (only one manager can have a username)
ALTER TABLE users 
    ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Step 7: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_owner_id ON users(owner_id);

-- Step 8: Add constraint to ensure managers have username and owner_id
-- (Optional but recommended for data integrity)
ALTER TABLE users 
    ADD CONSTRAINT users_manager_constraints 
    CHECK (
        (role = 'manager' AND username IS NOT NULL AND owner_id IS NOT NULL) OR
        (role != 'manager')
    );

-- Verification query (optional - run to check the changes)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- ORDER BY ordinal_position;

