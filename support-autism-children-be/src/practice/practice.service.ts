import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitPracticeDto } from './practice.dto';

@Injectable()
export class PracticeService {
  constructor(private readonly prisma: PrismaService) {}

  async submitPractice(userId: string, dto: SubmitPracticeDto) {
    const emotion = await this.prisma.emotion.findUnique({
      where: { id: dto.emotionId },
    });
    if (!emotion) throw new NotFoundException('Không tìm thấy Cảm xúc này');

    // 1. Lưu kết quả thực hành vào Practice
    const practice = await this.prisma.practice.create({
      data: {
        userId,
        emotionId: dto.emotionId,
        attemptsCount: dto.attemptsCount,
        correctCount: dto.correctCount,
        endTime: new Date(),
      },
    });

    // 2. Tính toán cập nhật cho User
    const duration = dto.durationMinutes || 1; // Mặc định 1 phút nếu không truyền
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // Lấy lại accuracyRate bằng cách gộp trung bình của Quiz (theo Score max) và Practice (theo tỉ lệ correct/attempts)
    // Để đơn giản, cứ tính lại accuracyRate dựa trên tất cả practices và quizzes
    const allPractices = await this.prisma.practice.findMany({ where: { userId } });
    let totalPracticeCorrect = 0;
    let totalPracticeAttempts = 0;
    allPractices.forEach((p) => {
      totalPracticeCorrect += p.correctCount;
      totalPracticeAttempts += p.attemptsCount;
    });
    const practiceAccuracy = totalPracticeAttempts > 0 ? totalPracticeCorrect / totalPracticeAttempts : 0;

    const allQuizzes = await this.prisma.attemptQuiz.findMany({ where: { userId } });
    let totalQuizScore = 0;
    allQuizzes.forEach((q) => {
      totalQuizScore += q.maxScore;
    });
    const quizAccuracy = allQuizzes.length > 0 ? totalQuizScore / allQuizzes.length : 0;

    // Lấy trung bình cộng của 2 loại hoạt động
    let overallAccuracy = 0;
    if (allPractices.length > 0 && allQuizzes.length > 0) {
      overallAccuracy = (practiceAccuracy + quizAccuracy) / 2;
    } else if (allPractices.length > 0) {
      overallAccuracy = practiceAccuracy;
    } else if (allQuizzes.length > 0) {
      overallAccuracy = quizAccuracy;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPracticeMinutes: { increment: duration },
        accuracyRate: Math.round(overallAccuracy * 100) / 100,
        lastActiveDate: new Date(),
      },
    });

    return practice;
  }
}
