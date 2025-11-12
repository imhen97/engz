DO $$
BEGIN
  -- 시도 1: 테이블이 없으면 새로 생성 (신규 배포 환경)
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = current_schema()
      AND table_name = 'LevelTestResult'
  ) THEN
    CREATE TABLE "LevelTestResult" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "levelSelected" TEXT NOT NULL,
      "vocabScore" INTEGER NOT NULL,
      "grammarScore" INTEGER NOT NULL,
      "writingScore" INTEGER NOT NULL,
      "overallLevel" TEXT NOT NULL,
      "strengths" TEXT,
      "weaknesses" TEXT,
      "recommendedRoutine" TEXT,
      "aiFeedback" TEXT,
      "aiPlan" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LevelTestResult_pkey" PRIMARY KEY ("id")
    );

    ALTER TABLE "LevelTestResult"
      ADD CONSTRAINT "LevelTestResult_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ELSE
    -- 시도 2: 테이블이 이미 있다면 필요한 컬럼만 추가
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'LevelTestResult'
        AND column_name = 'aiFeedback'
    ) THEN
      ALTER TABLE "LevelTestResult"
        ADD COLUMN "aiFeedback" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'LevelTestResult'
        AND column_name = 'aiPlan'
    ) THEN
      ALTER TABLE "LevelTestResult"
        ADD COLUMN "aiPlan" TEXT;
    END IF;
  END IF;
END;
$$;
