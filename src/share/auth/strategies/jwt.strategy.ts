import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { JwtPayload } from '../payloads/jwt-payload';
import { UserEntity } from 'src/api/user/user.entity';
import { UserRepository } from 'src/api/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition({ email: payload.email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
