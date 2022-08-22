import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashsaleService } from './flashsale.service';
import { CreateFlashsaleDto } from './dto/create-flashsale.dto';
import { UpdateFlashsaleDto } from './dto/update-flashsale.dto';

@Controller('flashsale')
export class FlashsaleController {
  constructor(private readonly flashsaleService: FlashsaleService) {}

  @Post()
  create(@Body() createFlashsaleDto: CreateFlashsaleDto) {
    return this.flashsaleService.create(createFlashsaleDto);
  }

  @Get()
  findAll() {
    return this.flashsaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashsaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashsaleDto: UpdateFlashsaleDto) {
    return this.flashsaleService.update(+id, updateFlashsaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashsaleService.remove(+id);
  }
}
