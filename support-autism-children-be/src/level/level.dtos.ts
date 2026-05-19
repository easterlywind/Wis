import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'Cấp độ 1', description: 'Tên level' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả level' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'Độ khó' })
  @IsInt()
  @Min(1)
  difficulty: number;

  @ApiPropertyOptional({ example: 0, description: 'Điểm yêu cầu để mở khóa' })
  @IsOptional()
  @IsInt()
  @Min(0)
  requiredPoints?: number;
}

export class UnlockLevel {
  @ApiProperty({
    example: '8f92fb64-6a55-4c44-9a3f-ae2b9e1c1a10',
    description: 'ID của người dùng',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '8f92fb64-6a55-4c44-9a3f-ae2b9e1c1a10',
    description: 'ID của level được mở khóa',
  })
  @IsUUID()
  @IsNotEmpty()
  levelId: string;
}
