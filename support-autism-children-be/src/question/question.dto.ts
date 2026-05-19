import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QuestionType, AnswerChoice } from '@prisma/client';

export class CreateQuestionDto {
  @ApiProperty({ description: 'ID của quiz chứa câu hỏi' })
  @IsUUID()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: 'ID của emotion liên quan' })
  @IsUUID()
  @IsNotEmpty()
  emotionId: string;

  @ApiProperty({ description: 'Nội dung câu hỏi' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: QuestionType, description: 'Loại câu hỏi' })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @ApiPropertyOptional({ description: 'URL media (hình ảnh, video, audio)' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ description: 'Đáp án A' })
  @IsString()
  @IsNotEmpty()
  optionA: string;

  @ApiProperty({ description: 'Đáp án B' })
  @IsString()
  @IsNotEmpty()
  optionB: string;

  @ApiPropertyOptional({ description: 'Đáp án C' })
  @IsOptional()
  @IsString()
  optionC?: string;

  @ApiPropertyOptional({ description: 'Đáp án D' })
  @IsOptional()
  @IsString()
  optionD?: string;

  @ApiProperty({ enum: AnswerChoice, description: 'Đáp án đúng' })
  @IsEnum(AnswerChoice)
  @IsNotEmpty()
  correctAnswer: AnswerChoice;

  @ApiPropertyOptional({ description: 'Gợi ý dạng text' })
  @IsOptional()
  @IsString()
  hintText?: string;

  @ApiPropertyOptional({ description: 'Gợi ý dạng media URL' })
  @IsOptional()
  @IsString()
  hintMediaUrl?: string;
}
