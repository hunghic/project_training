import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { ValidatorService } from './validators/check-expiration-time';
import { ERROR } from '../common/error-code.const';
import { CreateUserDto } from 'src/api/user/dto/create-user.dto';
import { UserEntity } from 'src/api/user/user.entity';
// import { from, map, switchMap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validatorService: ValidatorService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userService.getUserByEmail(email);
    const hashPassword = bcrypt.compareSync(password, user.password);
    if (!hashPassword) throw new BadRequestException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    const payload: JwtPayload = {
      email: user.email,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);
    return {
      accessToken: await this.jwtService.signAsync(payload, { secret: JWT_CONFIG.secret, expiresIn: jwtExpiresIn }),
      accessTokenExpire: jwtExpiresIn,
    };
  }
  async getOneUser(id: string) {
    const userFound = await this.userService.getOneUser(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.userService.getOneUser(id);
  }
  async register(user: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(user);
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
