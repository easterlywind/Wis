import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwt: JwtService) { }

    use(req: any, res: any, next: () => void) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new UnauthorizedException("Missing token");
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = this.jwt.verify(token);
            req.user = decoded;
            next();
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
