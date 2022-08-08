import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { Response, NextFunction } from 'express';

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  use(request: any, response: Response, next: NextFunction): void {
    const token: string = <string>request.headers.authorization;
    if (token) {
      const jwtService = new JwtService({
        secret: JWT_CONFIG.secret,
        signOptions: {
          expiresIn: JWT_CONFIG.expiresIn,
        },
      });
      request.user = jwtService.decode(token.substring(7)) as any;
    }
    next();
  }
}
