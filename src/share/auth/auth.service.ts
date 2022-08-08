import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { ValidatorService } from './validators/check-expiration-time';
import { ERROR } from '../common/error-code.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validatorService: ValidatorService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.userService.getByUserId(username);
    if (user.issuedDate && user.daysInTrial && user.daysInTrial !== '-') {
      if (this.validatorService.checkExpirationTime(user.issuedDate, parseInt(user.daysInTrial)))
        throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const hashPassword = bcrypt.compareSync(password, user.password);
    if (!hashPassword) throw new BadRequestException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    const payload: JwtPayload = {
      userId: username,
      email: user.email,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);
    return {
      accessToken: await this.jwtService.signAsync(payload, { secret: JWT_CONFIG.secret, expiresIn: jwtExpiresIn }),
      accessTokenExpire: jwtExpiresIn,
    };
  }
  googleLogin(@Req() req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
