-- AlterTable: Add gamified test fields to LevelTestResult
ALTER TABLE "LevelTestResult" 
  ADD COLUMN IF NOT EXISTS "totalScore" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "avgSpeed" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "rankPercent" INTEGER,
  ADD COLUMN IF NOT EXISTS "aiMent" TEXT;

-- Make levelSelected optional (nullable)
ALTER TABLE "LevelTestResult" 
  ALTER COLUMN "levelSelected" DROP NOT NULL;

