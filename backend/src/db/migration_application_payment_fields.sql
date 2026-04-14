-- Add payment tracking fields to approved applications

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS last_payment_date DATE;

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS paid_months INTEGER;

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
