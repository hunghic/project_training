import { OrderEntity } from 'src/api/order/entities/order.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VOUCHER_CONST } from '../voucher.constant';

@Entity({ name: VOUCHER_CONST.MODEL_NAME })
export class VoucherEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ default: null })
  discount: number;

  @Column({ default: null })
  quantity: number;

  @ManyToOne(() => OrderEntity, (product) => product.vouchers, {
    eager: true,
  })
  order: OrderEntity;
}
