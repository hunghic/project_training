import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { USER_CONST } from './user.constant';
import { BaseEntity } from '../../share/database/BaseEntity';
import { Role } from './role.enum';
import { OrderEntity } from '../order/entities/order.entity';
import { FlashsaleDetailEntity } from '../flashsale-detail/entities/flashsale-detail.entity';

@Entity({ name: USER_CONST.MODEL_NAME })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255, select: false })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ length: 255, default: null })
  code: string;

  @Column({ length: 255, default: null })
  expriseIn: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @ManyToOne(() => FlashsaleDetailEntity, (flashsaleDetail) => flashsaleDetail.users)
  flashsaleDetail: FlashsaleDetailEntity;
}
