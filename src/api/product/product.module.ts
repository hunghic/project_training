import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/configs/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProductRepository } from './product.repository';
import { productProvider } from './product.provider';

@Module({
  imports: [DatabaseModule, MulterModule.register({ dest: './uploads' })],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ...productProvider],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
