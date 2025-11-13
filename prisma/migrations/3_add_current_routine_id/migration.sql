-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentRoutineId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentRoutineId_fkey" FOREIGN KEY ("currentRoutineId") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

