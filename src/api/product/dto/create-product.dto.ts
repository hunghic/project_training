import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  describe: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   issuedBy: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   issuedDate: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   daysInTrial: string;
}
