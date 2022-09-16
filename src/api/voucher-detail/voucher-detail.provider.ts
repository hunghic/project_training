import { Connection } from 'typeorm';
import { VoucherDetailEntity } from './entities/voucher-detail.entity';
import { VOUCHERDETAIL_CONST } from './voucher-detail.constant';
export const voucherDetailProvider = [
  {
    provide: VOUCHERDETAIL_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(VoucherDetailEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
