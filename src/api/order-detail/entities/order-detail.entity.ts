import { OrderEntity } from 'src/api/order/entities/order.entity';
import { ProductEntity } from 'src/api/product/entities/product.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ORDERDETAIL_CONST } from '../order-detail.constant';

@Entity({ name: ORDERDETAIL_CONST.MODEL_NAME })
export class OrderDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  price: number;

  @Column({ default: null })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails, { onDelete: 'CASCADE', eager: true })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderDetails, {})
  product: number;
}
