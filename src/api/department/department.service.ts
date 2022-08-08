import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const newDepartment = this.departmentRepository.create(createDepartmentDto);
    const createDepartment = await this.departmentRepository.save(newDepartment);
    if (!newDepartment) {
      throw new NotFoundException('Error create new users');
    }
    return createDepartment;
  }

  findAll() {
    return `This action returns all department`;
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  async delete(id: string) {
    const departmentFound = await this.departmentRepository.delete(id);
    if (!departmentFound) {
      throw new NotFoundException('not found!');
    }
    return 'Success!';
  }
}
