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

  async getAllUser(): Promise<BrandEntity> {
    return this.brandRepository.getAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
