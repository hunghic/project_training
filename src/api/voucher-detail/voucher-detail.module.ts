import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/configs/database/database.module';
import { UserModule } from '../user/user.module';
import { VoucherModule } from '../voucher/voucher.module';
import { VoucherDetailController } from './voucher-detail.controller';
import { voucherDetailProvider } from './voucher-detail.provider';
import { VoucherDetailRepository } from './voucher-detail.repository';
import { VoucherDetailService } from './voucher-detail.service';
@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' }), UserModule, VoucherModule],
  controllers: [VoucherDetailController],
  providers: [VoucherDetailService, VoucherDetailRepository, ...voucherDetailProvider],
  exports: [VoucherDetailService, VoucherDetailRepository],
})
export class VoucherDetailModule {}
