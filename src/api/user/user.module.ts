import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/configs/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' })],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...userProvider],
  exports: [UserService, UserRepository],
})
export class UserModule {}
