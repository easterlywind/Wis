// question.entity.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, AnswerChoice } from '@prisma/client';

export class Question {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quizId: string;

  @ApiProperty()
  emotionId: string;

  @ApiProperty({ enum: QuestionType })
  questionType: QuestionType;

  @ApiPropertyOptional()
  mediaUrl?: string;

  @ApiProperty()
  optionA: string;

  @ApiProperty()
  optionB: string;

  @ApiPropertyOptional()
  optionC?: string;

  @ApiPropertyOptional()
  optionD?: string;

  @ApiProperty({ enum: AnswerChoice })
  correctAnswer: AnswerChoice;

  @ApiPropertyOptional()
  hintText?: string;

  @ApiPropertyOptional()
  hintMediaUrl?: string;

  constructor(data: Partial<Question>) {
    Object.assign(this, data);
  }
}
