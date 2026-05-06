import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(dto: SignUpDto) {
    // Check if user exists
    const userExists = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (userExists) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const parsedBirthDate = dto.birthDate ? new Date(dto.birthDate) : null;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.username,
        email: dto.email,
        password: hashedPassword,
        birthDate: parsedBirthDate,
      },
    });

    const { accessToken, refreshToken } = await this.getTokens(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        birthDate: parsedBirthDate,
      },
    };
  }

  async signIn(dto: SignInDto) {
    console.log("Login attempt for:", dto.email);
    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { name: dto.email }
        ]
      },
    });
    if (!user) {
      console.log("User not found in DB");
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      console.log("Password compare failed for user:", user.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const { accessToken, refreshToken } = await this.getTokens(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
        user.id,
        user.email,
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout() {
    // For JWT, logout is typically handled on the client side by deleting the token.
    return { message: 'Logout successful' };
  }
}