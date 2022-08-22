import { ProductEntity } from 'src/api/product/entities/product.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FLASHSALE_CONST } from '../flashsale.constant';

@Entity({ name: FLASHSALE_CONST.MODEL_NAME })
export class FlashsaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  discount: string;

  @OneToMany(() => ProductEntity, (product) => product.flashsale)
  products: ProductEntity[];
}
