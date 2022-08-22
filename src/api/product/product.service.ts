import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductDto, @UploadedFile() image: Express.Multer.File): Promise<ProductEntity> {
    const newProduct = this.productRepository.create({ image: image.path, ...data });
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

  async updateByUserId(id: string, updateProductDto: UpdateProductDto) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.productRepository.update(productFound.id, updateProductDto);

    return this.productRepository.findOneByCondition({ id: productFound.id });
  }
  async remove(id: number) {
    const categoryFound = await this.productRepository.findOneByCondition(id);
    if (!categoryFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.productRepository.delete(id);
    return 'Success!';
  }
  async productSearch(conditions: unknown) {
    return this.productRepository.productSearch(conditions);
  }
  async getPrice(id: number) {
    const productFound = await this.productRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await this.productRepository.findOneByCondition(id)).price;
  }
}
