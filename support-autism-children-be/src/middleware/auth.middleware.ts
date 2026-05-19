import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
      const decoded = this.jwt.verify(token, { secret });
      req.user = decoded;
      if (decoded.sub) {
        req.user.userId = decoded.sub; // Ensure req.user.userId is set for controllers
      }
      next();
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
