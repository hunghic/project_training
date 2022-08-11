import { BrandEntity } from 'src/api/brand/entities/brand.entity';
import { CategoryEntity } from 'src/api/category/entities/category.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_CONST } from '../product.constant';

@Entity({ name: PRODUCT_CONST.MODEL_NAME })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  describe: string;

  @Column({ default: null })
  price: number;

  @Column({ default: null })
  quantity: number;

  @Column({ default: null })
  discount: number;

  @Column({ length: 255, default: null })
  image: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'SET NULL',
    eager: true,
  })
  brand: BrandEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  category: BrandEntity;
}
