/*
  Warnings:

  - You are about to drop the column `attemptscount` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `endtime` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `levelid` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `maxscore` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `starttime` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `AttemptLevel` table. All the data in the column will be lost.
  - You are about to drop the column `emotionId` on the `AttemptQuiz` table. All the data in the column will be lost.
  - Added the required column `userId` to the `AttemptLevel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AttemptLevel" DROP CONSTRAINT "AttemptLevel_levelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttemptLevel" DROP CONSTRAINT "AttemptLevel_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttemptQuiz" DROP CONSTRAINT "AttemptQuiz_quizId_fkey";

-- AlterTable
ALTER TABLE "AttemptLevel" DROP COLUMN "attemptscount",
DROP COLUMN "endtime",
DROP COLUMN "levelid",
DROP COLUMN "maxscore",
DROP COLUMN "starttime",
DROP COLUMN "userid",
ADD COLUMN     "attemptsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "levelId" TEXT,
ADD COLUMN     "maxScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AttemptQuiz" DROP COLUMN "emotionId";

-- AddForeignKey
ALTER TABLE "AttemptQuiz" ADD CONSTRAINT "AttemptQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptLevel" ADD CONSTRAINT "AttemptLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptLevel" ADD CONSTRAINT "AttemptLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
