import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class SubmitPracticeDto {
  @ApiProperty({ description: 'ID của cảm xúc đang thực hành' })
  @IsString()
  emotionId: string;

  @ApiProperty({ description: 'Tổng số lần thử' })
  @IsInt()
  attemptsCount: number;

  @ApiProperty({ description: 'Tổng số lần đúng' })
  @IsInt()
  correctCount: number;

  @ApiProperty({
    description: 'Thời lượng thực hành (tính bằng phút)',
    required: false,
  })
  @IsInt()
  @IsOptional()
  durationMinutes?: number;
}
