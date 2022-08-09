import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}
  async create(data: CreateBrandDto): Promise<BrandEntity> {
    const newBrand = await this.brandRepository.create(data);
    const createBrand = await this.brandRepository.save(newBrand);
    if (!newBrand) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createBrand;
  }

  async getAllBrand(): Promise<BrandEntity> {
    return this.brandRepository.getAll();
  }

  async findOne(id: number) {
    const productFound = await this.brandRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.brandRepository.findOneByCondition(id);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brandFound = await this.brandRepository.findOneByCondition(id);
    if (!brandFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.brandRepository.update(brandFound.id, updateBrandDto);

    return this.brandRepository.findOneByCondition({ id: brandFound.id });
  }

  remove(id: number) {
    const brandFound = this.brandRepository.delete(id);
    if (!brandFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.brandRepository.listSearch(name);
  }
}
