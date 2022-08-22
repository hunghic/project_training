import { OrderDetailEntity } from 'src/api/order-detail/entities/order-detail.entity';
import { UserEntity } from 'src/api/user/user.entity';
import { VoucherEntity } from 'src/api/voucher/entities/voucher.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ORDER_CONST } from '../order.constant';

@Entity({ name: ORDER_CONST.MODEL_NAME })
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  pay: number;

  @Column({ default: false })
  isBuy: boolean;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    eager: true,
  })
  user: UserEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetails) => orderDetails.order, { cascade: true })
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => VoucherEntity, (voucher) => voucher.order)
  vouchers: VoucherEntity[];
}
