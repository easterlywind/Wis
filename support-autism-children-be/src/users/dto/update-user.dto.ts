import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Nguyen Van A Updated',
    description: 'Tên mới của người dùng',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '2005-06-08T00:00:00.000Z',
    description: 'Ngày sinh mới của người dùng',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Link avatar mới của người dùng',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;
}
