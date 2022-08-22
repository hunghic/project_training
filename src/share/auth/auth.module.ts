import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { AuthController } from './auth.controller';
import { ValidatorService } from './validators/check-expiration-time';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from 'src/api/user/user.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { OrderModule } from 'src/api/order/order.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: process.env.GG_USER,
          pass: process.env.GG_PASS,
        },
      },
    }),
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: {
        expiresIn: JWT_CONFIG.expiresIn,
      },
    }),
    UserModule,
    OrderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ValidatorService, GoogleStrategy, JwtAuthGuard, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
