import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuestionService } from '../question/question.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuizController],
  providers: [PrismaService, QuestionService, QuizService]
})
export class QuizModule {}
