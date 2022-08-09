import { ProductEntity } from 'src/api/product/entities/product.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CATEGORY_CONST } from '../category.constant';

@Entity({ name: CATEGORY_CONST.MODEL_NAME })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  describe: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
