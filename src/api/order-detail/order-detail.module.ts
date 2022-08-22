import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/configs/database/database.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { OrderDetailController } from './order-detail.controller';
import { orderDetailProvider } from './order-detail.provider';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDetailService } from './order-detail.service';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' }), ProductModule, forwardRef(() => OrderModule)],
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderDetailRepository, ...orderDetailProvider],
  exports: [OrderDetailService, OrderDetailRepository],
})
export class OrderDetailModule {}
