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

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ValidatorService, GoogleStrategy, JwtAuthGuard, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
