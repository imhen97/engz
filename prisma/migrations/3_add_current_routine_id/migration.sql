-- AlterTable: Add currentRoutineId column (safe, won't fail if column exists)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentRoutineId" TEXT;

-- AddForeignKey: Only if Routine table exists
-- This migration is idempotent and safe to re-run
DO $$
BEGIN
  -- Check if Routine table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Routine') THEN
    -- Drop existing constraint if it exists (safe)
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_schema = 'public' 
      AND table_name = 'User' 
      AND constraint_name = 'User_currentRoutineId_fkey'
    ) THEN
      ALTER TABLE "User" DROP CONSTRAINT "User_currentRoutineId_fkey";
    END IF;
    
    -- Add foreign key constraint only if Routine table exists
    ALTER TABLE "User" ADD CONSTRAINT "User_currentRoutineId_fkey" 
      FOREIGN KEY ("currentRoutineId") REFERENCES "Routine"("id") 
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
EXCEPTION
  WHEN others THEN
    -- If any error occurs (e.g., constraint already exists), just continue
    -- This makes the migration idempotent
    RAISE NOTICE 'Migration 3: Skipping foreign key constraint (Routine table may not exist or constraint already exists)';
END $$;

