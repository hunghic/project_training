import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { DEPARTMENT_CONST } from './department.constant';
import { DepartmentEntity } from './entities/department.entity';

@Injectable()
export class DepartmentRepository extends TypeOrmRepository<DepartmentEntity> {
  constructor(
    @Inject(DEPARTMENT_CONST.MODEL_PROVIDER)
    departmentEntity: Repository<DepartmentEntity>,
  ) {
    super(departmentEntity);
  }
}
