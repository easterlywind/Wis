import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate random emotion-matching rounds.
   * Each round: one correct emotion + 3 random distractors.
   */
  async generateEmotionMatch(count = 10) {
    const allEmotions = await this.prisma.emotion.findMany({
      select: { id: true, name: true, iconUrl: true },
    });

    if (allEmotions.length < 4) {
      throw new Error('Cần ít nhất 4 cảm xúc trong DB để tạo game');
    }

    // Shuffle and pick `count` rounds (allow repeats if count > emotions)
    const rounds: Array<{
      roundIndex: number;
      correctEmotionId: string;
      correctEmotionName: string;
      iconUrl: string | null;
      options: { id: string; name: string }[];
    }> = [];
    for (let i = 0; i < count; i++) {
      // Pick a random correct emotion
      const correctIdx = Math.floor(Math.random() * allEmotions.length);
      const correct = allEmotions[correctIdx];

      // Pick 3 random distractors (different from correct)
      const distractors = allEmotions
        .filter((e) => e.id !== correct.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Build 4 options in random order
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

      rounds.push({
        roundIndex: i,
        correctEmotionId: correct.id,
        correctEmotionName: correct.name,
        iconUrl: correct.iconUrl,
        options: options.map((o) => ({
          id: o.id,
          name: o.name,
        })),
      });
    }

    return { totalRounds: count, rounds };
  }

  /**
   * Save game results and award points.
   */
  async submitGameResult(
    userId: string,
    data: {
      correctCount: number;
      totalRounds: number;
      timeSpentSeconds: number;
    },
  ) {
    const { correctCount, totalRounds, timeSpentSeconds } = data;

    // Award 1 point per correct answer
    const pointsEarned = correctCount;

    // Update user totalPoints
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPoints: true,
        currentLevel: true,
        streakDays: true,
        lastActiveDate: true,
      },
    });

    const newTotalPoints = (user?.totalPoints || 0) + pointsEarned;

    // Check level-up (same logic as quiz)
    const currentLevel = user?.currentLevel || 1;
    let levelUp = false;
    let finalLevel = currentLevel;

    const higherLevels = await this.prisma.level.findMany({
      where: { difficulty: { gt: currentLevel } },
      orderBy: { difficulty: 'asc' },
    });

    for (const nextLevel of higherLevels) {
      if (newTotalPoints >= nextLevel.requiredPoints) {
        levelUp = true;
        finalLevel = nextLevel.difficulty;

        const alreadyUnlocked = await this.prisma.unlockedLevel.findFirst({
          where: { userId, levelId: nextLevel.id },
        });
        if (!alreadyUnlocked) {
          await this.prisma.unlockedLevel.create({
            data: { userId, levelId: nextLevel.id },
          });
        }
      } else {
        break;
      }
    }

    // Update streak
    let newStreak = user?.streakDays || 0;
    if (user?.lastActiveDate) {
      const diffMs = Date.now() - new Date(user.lastActiveDate).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: newTotalPoints,
        streakDays: newStreak,
        lastActiveDate: new Date(),
        ...(levelUp ? { currentLevel: finalLevel } : {}),
      },
    });

    return {
      pointsEarned,
      correctCount,
      totalRounds,
      timeSpentSeconds,
      newTotalPoints,
      levelUp,
      newLevel: levelUp ? finalLevel : null,
    };
  }

  /**
   * Get weekly progress for a user (activities in last 7 days).
   */
  async getWeeklyProgress(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [quizCount, practiceCount] = await Promise.all([
      this.prisma.attemptQuiz.count({
        where: {
          userId,
          startTime: { gte: sevenDaysAgo },
        },
      }),
      this.prisma.practice.count({
        where: {
          userId,
          startTime: { gte: sevenDaysAgo },
        },
      }),
    ]);

    const completedActivities = quizCount + practiceCount;
    const totalTarget = 10; // Weekly goal: 10 activities
    const percentage = Math.min(
      100,
      Math.round((completedActivities / totalTarget) * 100),
    );

    return {
      completedActivities,
      totalTarget,
      percentage,
      breakdown: {
        quizzes: quizCount,
        practices: practiceCount,
      },
    };
  }
}
