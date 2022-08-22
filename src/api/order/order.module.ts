import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { OrderRepository } from './order.repository';
import { orderProvider } from './order.provider';
import { OrderDetailModule } from '../order-detail/order-detail.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({ dest: './uploads' }),
    forwardRef(() => OrderDetailModule),
    forwardRef(() => VoucherModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ...orderProvider],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
