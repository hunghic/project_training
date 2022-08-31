import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashsaleDetailService } from './flashsale-detail.service';
import { CreateFlashsaleDetailDto } from './dto/create-flashsale-detail.dto';
import { UpdateFlashsaleDetailDto } from './dto/update-flashsale-detail.dto';

@Controller('flashsale-detail')
export class FlashsaleDetailController {
  constructor(private readonly flashsaleDetailService: FlashsaleDetailService) {}

  @Post()
  create(@Body() createFlashsaleDetailDto: CreateFlashsaleDetailDto) {
    return this.flashsaleDetailService.create(createFlashsaleDetailDto);
  }

  @Get()
  findAll() {
    return this.flashsaleDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashsaleDetailService.getOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashsaleDetailDto: UpdateFlashsaleDetailDto) {
    return this.flashsaleDetailService.update(+id, updateFlashsaleDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashsaleDetailService.remove(+id);
  }
}
