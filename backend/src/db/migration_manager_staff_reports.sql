ALTER TABLE users
    ADD COLUMN IF NOT EXISTS can_generate_staff_reports BOOLEAN NOT NULL DEFAULT true;
