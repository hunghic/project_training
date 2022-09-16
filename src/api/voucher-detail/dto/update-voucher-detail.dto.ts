import { PartialType } from '@nestjs/swagger';
import { CreateVoucherDetailDto } from './create-voucher-detail.dto';

export class UpdateVoucherDetailDto extends PartialType(CreateVoucherDetailDto) {}
