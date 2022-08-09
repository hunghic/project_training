import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { USER_CONST } from './user.constant';
import { BaseEntity } from 'src/share/database/BaseEntity';
import { DepartmentEntity } from '../department/entities/department.entity';

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

  @Column({ length: 255, default: '' })
  issuedBy: string;

  @Column({ length: 255, default: '' })
  issuedDate: string;

  @Column({ length: 255, default: '' })
  daysInTrial: string;
  @ManyToOne(() => DepartmentEntity, (department) => department.users, {
    onDelete: 'SET NULL',
    eager: true,
  })
  department: DepartmentEntity;
}
