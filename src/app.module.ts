import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from './api/entity/entity.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './share/auth/auth.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { ProductModule } from './api/product/product.module';
import { CategoryModule } from './api/category/category.module';
import { BrandModule } from './api/brand/brand.module';
import { OrderModule } from './api/order/order.module';
import { FeedbackModule } from './api/feedback/feedback.module';
import { VoucherModule } from './api/voucher/voucher.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EntityModule,
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    OrderModule,
    FeedbackModule,
    VoucherModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
