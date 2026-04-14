import pool from './database.js';

async function addApplicationPaymentFields() {
    try {
        console.log('Adding payment tracking fields to applications table...');

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS last_payment_date DATE
        `);

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS paid_months INTEGER
        `);

        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'applications_paid_months_check'
                ) THEN
                    ALTER TABLE applications
                    ADD CONSTRAINT applications_paid_months_check
                    CHECK (paid_months IS NULL OR paid_months > 0);
                END IF;
            END $$;
        `);

        console.log('Application payment fields are ready');
        process.exit(0);
    } catch (error) {
        console.error('Failed to add application payment fields:', error);
        process.exit(1);
    }
}

addApplicationPaymentFields();
