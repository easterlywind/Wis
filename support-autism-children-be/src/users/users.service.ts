import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        avatarUrl: true,
        totalPoints: true,
        streakDays: true,
        accuracyRate: true,
        totalPracticeMinutes: true,
        currentLevel: true,
        lastActiveDate: true,
      },
    });
  }

  findOne(id_user: string) {
    return this.prisma.user.findUnique({
      where: { id: id_user },
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        avatarUrl: true,
        totalPoints: true,
        streakDays: true,
        accuracyRate: true,
        totalPracticeMinutes: true,
        currentLevel: true,
        lastActiveDate: true,
        unlockedLevels: true,
        attemptQuizzes: true,
        practices: true,
      },
    });
  }

  update(id_user: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id_user },
      data: updateUserDto,
      select: {
        name: true,
        birthDate: true,
        avatarUrl: true,
      },
    });
  }

  remove(id_user: string) {
    return this.prisma.user.delete({
      where: { id: id_user },
      select: { id: true, email: true, name: true },
    });
  }

  /**
   * Thống kê tổng quan: tổng quiz, điểm, accuracy, streak...
   */
  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPoints: true,
        streakDays: true,
        accuracyRate: true,
        currentLevel: true,
        lastActiveDate: true,
      },
    });

    const totalQuizzes = await this.prisma.attemptQuiz.count({
      where: { userId },
    });

    const attempts = await this.prisma.attemptQuiz.findMany({
      where: { userId },
      select: { maxScore: true },
    });

    const avgAccuracy =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((s, a) => s + a.maxScore, 0) / attempts.length,
          )
        : 0;

    // Đếm quiz đạt ≥ 80% (tính là "hoàn thành tốt")
    const excellentQuizzes = attempts.filter((a) => a.maxScore >= 80).length;

    return {
      totalPoints: user?.totalPoints ?? 0,
      streakDays: user?.streakDays ?? 0,
      accuracyRate: user?.accuracyRate ?? 0,
      currentLevel: user?.currentLevel ?? 1,
      totalQuizzes,
      excellentQuizzes,
      lastActiveDate: user?.lastActiveDate,
    };
  }

  /**
   * Thống kê độ chính xác theo từng cảm xúc
   * → Dùng cho biểu đồ radar/bar trên Progress page
   */
  async getEmotionStats(userId: string) {
    // Lấy tất cả attempt của user, join với quiz → questions → emotion
    const attempts = await this.prisma.attemptQuiz.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                emotion: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    // Aggregate theo emotion
    const emotionMap = new Map<
      string,
      { name: string; total: number; correct: number }
    >();

    for (const attempt of attempts) {
      if (!attempt.quiz) continue;
      for (const question of attempt.quiz.questions) {
        const emotionName = question.emotion.name;
        if (!emotionMap.has(emotionName)) {
          emotionMap.set(emotionName, {
            name: emotionName,
            total: 0,
            correct: 0,
          });
        }
        const stat = emotionMap.get(emotionName)!;
        stat.total += 1;
        // Ước lượng: nếu quiz accuracy >= 80% thì coi là đúng cho emotion đó
        // (simplified — không có per-question answer log hiện tại)
        if (attempt.maxScore >= 80) {
          stat.correct += 1;
        }
      }
    }

    return Array.from(emotionMap.values()).map((e) => ({
      emotion: e.name,
      totalQuestions: e.total,
      accuracy: e.total > 0 ? Math.round((e.correct / e.total) * 100) : 0,
    }));
  }

  /**
   * Lịch sử hoạt động 7 ngày gần nhất
   */
  async getActivityHistory(userId: string) {
    const attempts = await this.prisma.attemptQuiz.findMany({
      where: { userId },
      orderBy: { endTime: 'desc' },
      take: 50,
      include: {
        quiz: { select: { title: true } },
      },
    });

    // Group by date
    const dayMap = new Map<string, { quizzes: number; totalScore: number }>();

    for (const a of attempts) {
      const dateStr = (a.endTime || a.startTime).toISOString().split('T')[0];
      if (!dayMap.has(dateStr)) {
        dayMap.set(dateStr, { quizzes: 0, totalScore: 0 });
      }
      const day = dayMap.get(dateStr)!;
      day.quizzes += 1;
      day.totalScore += a.maxScore;
    }

    // Tạo 7 ngày gần nhất
    const result: {
      date: string;
      day: string;
      quizzes: number;
      accuracy: number;
    }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayLabel = dayLabels[d.getDay()];

      const data = dayMap.get(dateStr);
      result.push({
        date: dateStr,
        day: dayLabel,
        quizzes: data?.quizzes ?? 0,
        accuracy: data ? Math.round(data.totalScore / data.quizzes) : 0,
      });
    }

    // Recent activities list
    const recentActivities = attempts.slice(0, 10).map((a) => ({
      type: 'quiz' as const,
      title: a.quiz?.title || 'Quiz',
      score: a.maxScore,
      date: (a.endTime || a.startTime).toISOString(),
    }));

    return { dailyProgress: result, recentActivities };
  }
}
