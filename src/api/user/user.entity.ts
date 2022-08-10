import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_CONST } from './user.constant';
import { BaseEntity } from 'src/share/database/BaseEntity';

@Entity({ name: USER_CONST.MODEL_NAME })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ length: 255 })
  code: string;

  @Column({ length: 255 })
  expriseIn: string;
}