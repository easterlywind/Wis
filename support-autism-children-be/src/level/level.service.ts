import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLevelDto, UnlockLevel } from './level.dtos';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLevelDto) {
    return this.prisma.level.create({ data: dto });
  }

  async findAll() {
    return this.prisma.level.findMany({
      include: { quizzes: true },
    });
  }

  async unlockLevel(dto: UnlockLevel) {
    return this.prisma.unlockedLevel.create({ data: dto });
  }

  async findAllLevelsByUserId(
    userId: string,
  ): Promise<{ id: string; name: string; unlocked: boolean }[]> {
    // Fetch all levels
    const allLevels = await this.prisma.level.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Fetch all unlocked levels for this user
    const unlockedLevels = await this.prisma.unlockedLevel.findMany({
      where: { userId },
      select: { levelId: true },
    });

    const unlockedSet = new Set(unlockedLevels.map((l) => l.levelId));

    // Map levels with unlocked status
    return allLevels.map((level) => ({
      id: level.id,
      name: level.name,
      unlocked: unlockedSet.has(level.id),
    }));
  }

  async findOne(id: string) {
    const level = await this.prisma.level.findUnique({
      where: { id },
      include: { quizzes: true },
    });

    if (!level) {
      throw new NotFoundException(`Level ${id} not found`);
    }

    return level;
  }

  async getAllQuizByLevelId(userId: string, levelId: string) {
    const quizzes = await this.prisma.quiz.findMany({
      where: { levelId },
      select: {
        id: true,
        title: true,
        attempts: {
          where: { userId },
          select: {
            maxScore: true,
            attemptsCount: true,
          },
        },
      },
    });

    return quizzes;
  }
}
