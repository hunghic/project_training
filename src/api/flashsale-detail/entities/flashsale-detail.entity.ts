import { OrderEntity } from 'src/api/order/entities/order.entity';
import { ProductEntity } from 'src/api/product/entities/product.entity';
import { UserEntity } from 'src/api/user/user.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FLASHSALEDETAIL_CONST } from '../flashsale-detail.constant';

@Entity({ name: FLASHSALEDETAIL_CONST.MODEL_NAME })
export class FlashsaleDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  discount: number;

  @Column({ default: null })
  timeStart: Date;

  @Column({ default: null })
  timeEnd: Date;

  @Column({ default: null })
  timeNotify: Date;

  flashsale: OrderEntity;

  @OneToMany(() => ProductEntity, (product) => product.flashsaleDetail)
  products: ProductEntity[];

  @OneToMany(() => UserEntity, (user) => user.flashsaleDetail)
  users: UserEntity[];
}
