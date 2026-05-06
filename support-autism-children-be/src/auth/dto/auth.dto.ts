import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Tên hiển thị của người dùng',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email của người dùng (duy nhất)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu tài khoản, sẽ được hash trước khi lưu',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    example: '2005-06-08',
    description: 'Ngày sinh của người dùng',
    type: String,
  })
  @IsOptional()
  @IsString()
  birthDate?: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com hoặc username',
    description: 'Email hoặc tên đăng nhập',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu đăng nhập',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token để xin lại access token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
