import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from './api/entity/entity.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './share/auth/auth.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { DepartmentModule } from './api/department/department.module';

@Module({
  imports: [ConfigModule.forRoot(), EntityModule, UserModule, AuthModule, DepartmentModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
