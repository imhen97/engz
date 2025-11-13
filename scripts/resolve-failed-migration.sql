-- Script to resolve failed migration 3_add_current_routine_id
-- Run this in your Neon database console if migration fails

-- Mark the failed migration as rolled back
-- This allows new migrations to be applied

-- Option 1: If you want to keep the column but skip the foreign key
-- (Recommended if Routine table doesn't exist yet)
UPDATE "_prisma_migrations" 
SET finished_at = NOW(), 
    applied_steps_count = 1,
    logs = 'Migration partially applied: column added, foreign key skipped (Routine table does not exist)'
WHERE migration_name = '3_add_current_routine_id' 
AND finished_at IS NULL;

-- Option 2: If you want to mark it as rolled back completely
-- UPDATE "_prisma_migrations" 
-- SET rolled_back_at = NOW(),
--     finished_at = NOW(),
--     applied_steps_count = 0
-- WHERE migration_name = '3_add_current_routine_id' 
-- AND finished_at IS NULL;

