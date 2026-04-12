import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './question.dto';

@Injectable()
export class QuestionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateQuestionDto) {
        return this.prisma.question.create({ data: dto });
    }

    async findAll() {
        return this.prisma.question.findMany();
    }

    async findAllByQuizId(quizId: string) {
        return this.prisma.question.findMany({
            where: { quizId },
        });
    }

    async findOne(id: string) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        });
        if (!question) throw new NotFoundException(`Question ${id} not found`);
        return question;
    }
}
