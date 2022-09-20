import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { VoucherDetailService } from './voucher-detail.service';
import { CreateVoucherDetailDto } from './dto/create-voucher-detail.dto';
import { UpdateVoucherDetailDto } from './dto/update-voucher-detail.dto';
import { JwtAuthGuard } from 'src/share/auth/guards/jwt.guard';
import { RoleGuard } from 'src/share/auth/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Voucher-detail')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('voucher-detail')
export class VoucherDetailController {
  constructor(private readonly voucherDetailService: VoucherDetailService) {}

  @Post()
  create(@Body() createVoucherDetailDto: CreateVoucherDetailDto) {
    return this.voucherDetailService.create(createVoucherDetailDto);
  }

  @Get()
  findAll() {
    return this.voucherDetailService.findAll();
  }

  @Get('getByUserId')
  findByUserId(@Req() req: any) {
    const userId = req.user.id;
    const role = req.user.role;
    if (role === 'admin') return this.voucherDetailService.findAll();
    return this.voucherDetailService.findByUserId(+userId);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.voucherDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDetailDto: UpdateVoucherDetailDto) {
    return this.voucherDetailService.update(+id, updateVoucherDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherDetailService.remove(+id);
  }
}
