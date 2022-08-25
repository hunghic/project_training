import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Roles(Role.ADMIN)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // @Interval(3000)
  @Get()
  findAllPage(@Query('perPage') perPage = 5, @Query('pageNumber') pageNumber = 1) {
    return this.productService.findAllPage(+perPage, +pageNumber);
  }
  // @Get()
  // findAll() {
  //   return this.productService.findAll();
  // }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.productService.getDiscount(+id);
  }

  @Patch('add-flashsale/:id')
  addFlashsale(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productService.addFlashsale(id, updateProductDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  @Get('search')
  listSearch(@Query() query: any) {
    return this.productService.productSearch(query);
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(@UploadedFile() image: Express.Multer.File, @Body() body: CreateProductDto) {
    return this.productService.create(body, image);
  }
}
