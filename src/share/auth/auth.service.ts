import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { UserService } from '../../api/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { ValidatorService } from './validators/check-expiration-time';
import { ERROR } from '../common/error-code.const';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';
import { UserEntity } from '../../api/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validatorService: ValidatorService,
    private mailService: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userService.getUserByEmail(email);
    const hashPassword = bcrypt.compareSync(password, user.password);
    if (!hashPassword) throw new BadRequestException(ERROR.USERNAME_OR_PASSWORD_INCORRECT.MESSAGE);
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);
    if (user.isVerified === false) {
      throw new BadRequestException(ERROR.USER_NOT_VERIFIED.MESSAGE);
    }
    if (user.isVerified === true) {
      return {
        accessToken: await this.jwtService.signAsync(payload, { secret: JWT_CONFIG.secret, expiresIn: jwtExpiresIn }),
        accessTokenExpire: jwtExpiresIn,
      };
    }
  }
  async getOneUser(id: number) {
    const userFound = await this.userService.getOneUser(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.userService.getOneUser(id);
  }
  async register(user: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(user);
  }

  async googleLogin(@Req() req: any): Promise<unknown> {
    if (!req.user) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const { email, lastName, firstName } = req.user;
    const user = await this.userService.getUserByEmail(email);
    const newUser = !user ? await this.register({ email, name: `${firstName} ${lastName}`, password: '' }) : user;
    const payload: JwtPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.expiresIn);
    return {
      accessToken: await this.jwtService.signAsync(payload, { secret: JWT_CONFIG.secret, expiresIn: jwtExpiresIn }),
      accessTokenExpire: jwtExpiresIn,
    };
  }
  async verifyEmail(@Req() req: any): Promise<any> {
    const user = await this.userService.verifyEmail(req);
    // if (user && parseInt(user.expriseIn) > Date.now()) {
    //   return { message: 'late' };
    // }
    if (!user) {
      return { message: 'User not found' };
    }
    if (Number(user.expriseIn) * 1000 > Date.now()) {
      user.isVerified = true;
      user.expriseIn = null;
      user.code = null;
      await user.save();
      return {
        message: 'Verified successfully',
      };
    } else {
      return { message: 'Verified error' };
    }
  }
  async sendEmail(mail: string, code: string) {
    const response = await this.mailService.sendMail({
      to: mail,
      from: 'hungboxi12223@gmail.com',
      subject: 'Plain Text Email ✔',
      html: `<a href="http://localhost:8080/api/v1/auth/verify-email?code=${code}">Verify email</a>`,
    });
    return response;
  }
}
