import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { CreateVoucherDetailDto } from './dto/create-voucher-detail.dto';
import { UpdateVoucherDetailDto } from './dto/update-voucher-detail.dto';
import { VoucherDetailRepository } from './voucher-detail.repository';

@Injectable()
export class VoucherDetailService {
  constructor(private readonly voucherDetailRepository: VoucherDetailRepository) {}
  async create(createVoucherDetailDto: CreateVoucherDetailDto) {
    const newVoucherDetail = this.voucherDetailRepository.create(createVoucherDetailDto);
    if (!newVoucherDetail) {
      throw new BadRequestException(ERROR.EXISTED.MESSAGE);
    }
    const createVoucherDetail = await this.voucherDetailRepository.save(createVoucherDetailDto);
    return createVoucherDetail;
  }

  async findAll() {
    return this.voucherDetailRepository.getAll();
  }
  async findByUserId(userId: number) {
    return this.voucherDetailRepository.findByCondition(userId);
  }
  findOne(id: number) {
    return `This action returns a #${id} voucherDetail`;
  }

  update(id: number, updateVoucherDetailDto: UpdateVoucherDetailDto) {
    return `This action updates a #${id} voucherDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucherDetail`;
  }
}
