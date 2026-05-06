import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerChoice } from '@prisma/client';

export class AnswerDto {
  @ApiProperty({ description: 'ID của câu hỏi' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ enum: AnswerChoice, description: 'Đáp án người dùng chọn' })
  @IsEnum(AnswerChoice)
  selectedAnswer: AnswerChoice;
}

export class SubmitQuizDto {
  @ApiProperty({ type: [AnswerDto], description: 'Danh sách câu trả lời' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
