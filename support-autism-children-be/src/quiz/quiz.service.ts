import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionService } from '../question/question.service';
import { CreateQuizDto } from './quiz.dto';
import { Question } from '../question/question.entity';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionService: QuestionService,
    private readonly configService: ConfigService,
    @Optional() @Inject(REQUEST) private request?: Request,
  ) { }

  private getBaseUrl(): string {
    if (this.request) {
      const protocol = this.request.protocol || 'http';
      const host = this.request.get('host') || 'localhost:3000';
      return `${protocol}://${host}`;
    }
    return this.configService.get<string>('API_URL', 'http://localhost:3000');
  }

  private transformMediaUrl(question: Question): Question {
    if (question.mediaUrl) {
      const baseUrl = this.getBaseUrl();
      // Chuyển đổi đường dẫn mediaUrl thành URL đầy đủ
      // media_emotion/happy.png -> http://localhost:3000/media_emotion/happy.png
      if (question.mediaUrl.startsWith('media_emotion/')) {
        question.mediaUrl = `${baseUrl}/${question.mediaUrl}`;
      }
      // media_question/level1/quiz1/q1.jpg -> http://localhost:3000/media_question/level1/quiz1/q1.jpg
      else if (question.mediaUrl.startsWith('media_question/')) {
        question.mediaUrl = `${baseUrl}/${question.mediaUrl}`;
      }
    }
    return question;
  }

  async create(createQuizDto: CreateQuizDto) {
    const { title, levelId } = createQuizDto;

    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
    });
    if (!level) throw new NotFoundException('Level không tồn tại');

    return this.prisma.quiz.create({
      data: {
        title,
        levelId,
      },
      include: {
        level: { select: { id: true, name: true } },
        questions: { select: { id: true } },
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        skip,
        take: limit,
        include: {
          level: { select: { id: true, name: true } },
          _count: { select: { questions: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quiz.count(),
    ]);

    return {
      data: quizzes.map((q) => ({
        ...q,
        questionCount: q._count.questions,
        _count: undefined,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });
    if (!quiz) throw new NotFoundException('Quiz không tồn tại');

    const questions = await this.questionService.findAllByQuizId(id);

    // Transform mediaUrl cho tất cả câu hỏi
    const transformedQuestions = (questions as Question[]).map((q) =>
      this.transformMediaUrl(q),
    );

    return {
      ...quiz,
      questions: transformedQuestions,
    };
  }

  async getRandomQuizByLevel(levelId: string) {
    // take all quiz ids in this level
    const quizIds = await this.prisma.quiz.findMany({
      where: { levelId },
      select: {
        id: true,
      },
    });

    if (quizIds.length === 0) {
      throw new NotFoundException('Không có quiz nào trong level này');
    }

    const validQuizIds = quizIds.map((q) => q.id);

    if (validQuizIds.length === 0) {
      throw new BadRequestException(
        'Không có quiz nào có câu hỏi trong level này',
      );
    }

    // take random quiz id
    const randomQuizId =
      validQuizIds[Math.floor(Math.random() * validQuizIds.length)];

    const quiz = await this.findOne(randomQuizId);
    return quiz;
  }

  async getRandomQuiz() {
    const quizIds = await this.prisma.quiz.findMany({
      select: { id: true },
    });

    if (quizIds.length === 0) {
      throw new NotFoundException('Hiện tại chưa có quiz nào để chơi');
    }

    const randomIndex = Math.floor(Math.random() * quizIds.length);
    const randomQuizId = quizIds[randomIndex].id;

    const quiz = await this.findOne(randomQuizId);
    return quiz;
  }
}
