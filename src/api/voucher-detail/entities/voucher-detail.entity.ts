import { UserEntity } from 'src/api/user/user.entity';
import { VoucherEntity } from 'src/api/voucher/entities/voucher.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VOUCHERDETAIL_CONST } from '../voucher-detail.constant';
import { BaseEntity } from '../../../share/database/BaseEntity';

@Entity({ name: VOUCHERDETAIL_CONST.MODEL_NAME })
export class VoucherDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => VoucherEntity, (voucher) => voucher.voucherDetails, { onDelete: 'CASCADE', eager: true })
  voucher: VoucherEntity;

  @ManyToOne(() => UserEntity, (voucher) => voucher.voucherDetails, {})
  user: UserEntity;
}
