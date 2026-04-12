import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ example: 'Cảm xúc cơ bản - Nhận biết khuôn mặt' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'ID của Level mà quiz thuộc về' })
  @IsUUID()
  @IsNotEmpty()
  levelId: string;
}
