import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  // @IsNumber()
  // price: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
