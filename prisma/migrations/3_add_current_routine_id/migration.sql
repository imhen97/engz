-- AlterTable: Add currentRoutineId column
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentRoutineId" TEXT;

-- AddForeignKey: Only if Routine table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Routine') THEN
    -- Drop existing constraint if it exists
    ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_currentRoutineId_fkey";
    -- Add foreign key constraint
    ALTER TABLE "User" ADD CONSTRAINT "User_currentRoutineId_fkey" 
      FOREIGN KEY ("currentRoutineId") REFERENCES "Routine"("id") 
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

