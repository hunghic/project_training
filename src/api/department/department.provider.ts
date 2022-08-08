import { Connection } from 'typeorm';
import { DEPARTMENT_CONST } from './department.constant';
import { DepartmentEntity } from './entities/department.entity';

export const departmentProvider = [
  {
    provide: DEPARTMENT_CONST.MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.getRepository(DepartmentEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
