import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    const newProduct = await this.productRepository.create(data);
    const createProduct = await this.productRepository.save(newProduct);
    if (!newProduct) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createProduct;
  }

  findAll(): Promise<ProductEntity> {
    return this.productRepository.getAll();
  }

  async findOne(id: number) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.productRepository.findOneByCondition(id);
  }

  async updateByUserId(productId: string, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(productId);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.productRepository.update(productFound.id, updateProductDto);

    return this.productRepository.findOneByCondition({ id: productFound.id });
  }
  remove(id: number) {
    const productFound = this.productRepository.delete(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.productRepository.listSearch(name);
  }
}
