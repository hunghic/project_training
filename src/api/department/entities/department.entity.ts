import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DEPARTMENT_CONST } from '../department.constant';
import { UserEntity } from 'src/api/user/user.entity';

@Entity({ name: DEPARTMENT_CONST.MODEL_NAME })
export class DepartmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, default: null })
  name: string;

  @Column({ length: 255, default: null })
  description: string;

  @OneToMany(() => UserEntity, (user) => user.department)
  users: UserEntity[];
}
