import { BadRequestException, CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
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
import { UserRepository } from 'src/api/user/user.repository';
import { v4 as uuid } from 'uuid';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly validatorService: ValidatorService,
    private mailService: MailerService,
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    };
    const accessExpiresIn = parseInt(JWT_CONFIG.accExpiresIn);
    const refreshExpiresIn = parseInt(JWT_CONFIG.refExpiresIn);
    if (user.isVerified === false) {
      throw new BadRequestException(ERROR.USER_NOT_VERIFIED.MESSAGE);
    }
    if (user.isVerified === true) {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: JWT_CONFIG.secret,
        expiresIn: accessExpiresIn,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: JWT_CONFIG.refSecret,
        expiresIn: refreshExpiresIn,
      });
      await this.cacheManager.set('refreshToken:' + payload.id, refreshToken, {
        ttl: +process.env.REFRESH_TOKEN_EXPIRED_IN,
      });
      return {
        accessToken,
        refreshToken,
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
    const newUser = !user
      ? await this.register({ email, name: `${firstName} ${lastName}`, password: '', isVerified: true })
      : user;
    const payload: JwtPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const jwtExpiresIn = parseInt(JWT_CONFIG.accExpiresIn);
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

  async resetPassword(@Req() req: any): Promise<any> {
    const user = await this.userService.verifyEmail(req);
    if (!user) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const passwordToUser = user.code;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(passwordToUser, salt);
    user.password = hashPassword;
    user.code = null;
    user.timeResetPwd = 0;
    await user.save();

    return {
      password: passwordToUser,
    };
  }
  async sendEmails(mail: string, code: string) {
    const response = await this.mailService.sendMail({
      to: mail,
      from: process.env.GG_USER,
      subject: 'Plain Text Email ✔',
      html: `<a href="http://localhost:8080/api/v1/auth/verify-email?code=${code}">Verify email</a>`,
    });
    return response;
  }

  async sendEmailss(mail: string, code: string) {
    const response = await this.mailService.sendMail({
      to: mail,
      from: process.env.GG_USER,
      subject: 'Plain Text Email ✔',
      html: `<a href="http://localhost:8080/api/v1/auth/verify-emails?code=${code}">Verify email</a>`,
    });
    return response;
  }
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneByCondition({ email: email });
    if (!user) {
      // throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
      throw new HttpException('Not found your email!', HttpStatus.NOT_FOUND);
    }
    const userId = user.id;
    const userSpamCheck = user.timeResetPwd;
    const code = uuid();
    const date = new Date();
    if (userSpamCheck + 1 > 5) {
      {
        if (Number(date) > Number(user.updatedAt) + 1000 * 60 * 60) {
          const userSpamCheck = 0;
          await this.userRepository.update(userId, { code: code, timeResetPwd: userSpamCheck + 1 });
          await this.sendEmailss(email, code);
          return {
            message: 'Check your email',
          };
        }
      }
      throw new HttpException(
        'Your get email for 5 time or more than, please check your email. We will send you a notification email in the next 1 hour',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update(userId, { code: code, timeResetPwd: userSpamCheck + 1 });
    await this.sendEmailss(email, code);
    return {
      message: 'Check your email',
    };
  }
}
