import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DatabaseModule } from 'src/configs/database/database.module';
import { DepartmentRepository } from './department.repository';
import { departmentProvider } from './department.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository, ...departmentProvider],
})
export class DepartmentModule {}
