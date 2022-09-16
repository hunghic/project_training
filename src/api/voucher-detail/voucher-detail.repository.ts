import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '../../share/database/typeorm.repository';
import { VoucherDetailEntity } from './entities/voucher-detail.entity';
import { VOUCHERDETAIL_CONST } from './voucher-detail.constant';

@Injectable()
export class VoucherDetailRepository extends TypeOrmRepository<VoucherDetailEntity> {
  constructor(
    @Inject(VOUCHERDETAIL_CONST.MODEL_PROVIDER)
    voucherDetailEntity: Repository<VoucherDetailEntity>,
  ) {
    super(voucherDetailEntity);
  }
}
