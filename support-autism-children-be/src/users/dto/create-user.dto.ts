import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng (duy nhất trong hệ thống)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu người dùng. Sẽ được hash trước khi lưu.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Tên hiển thị của người dùng',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
