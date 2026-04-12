ALTER TABLE "AttemptQuiz"
DROP CONSTRAINT "AttemptQuiz_levelId_fkey";

ALTER TABLE "AttemptQuiz"
DROP CONSTRAINT "AttemptQuiz_emotionId_fkey";

ALTER TABLE "AttemptQuiz" DROP COLUMN IF EXISTS "levelId";
ALTER TABLE "AttemptQuiz" ADD COLUMN "quizId" TEXT;

ALTER TABLE "AttemptQuiz"
ADD CONSTRAINT "AttemptQuiz_quizId_fkey"
FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE;

ALTER TABLE "AttemptQuiz"
RENAME COLUMN "correctCount" TO "maxScore";

CREATE TABLE "AttemptLevel" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    userId TEXT NOT NULL,
    levelId TEXT,
    startTime TIMESTAMPTZ NOT NULL DEFAULT now(),
    endTime TIMESTAMPTZ,
    maxScore INT NOT NULL DEFAULT 0,
    attemptsCount INT NOT NULL DEFAULT 0,

    -- Foreign keys
    CONSTRAINT "AttemptLevel_userId_fkey" FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT "AttemptLevel_levelId_fkey" FOREIGN KEY (levelId) REFERENCES "Level"(id) ON DELETE CASCADE
);