import { ProductEntity } from '../../../api/product/entities/product.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BRAND_CONST } from '../brand.constant';

@Entity({ name: BRAND_CONST.MODEL_NAME })
export class BrandEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  describe: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];
}
