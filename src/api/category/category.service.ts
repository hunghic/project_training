import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryRepository.create(createCategoryDto);
    const createCategory = await this.categoryRepository.save(newCategory);
    if (!newCategory) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createCategory;
  }

  findAll(): Promise<CategoryEntity> {
    return this.categoryRepository.getAll();
  }

  async findOne(id: number) {
    const categoryFound = await this.categoryRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.categoryRepository.findOneByCondition(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
