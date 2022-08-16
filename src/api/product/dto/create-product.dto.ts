import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  describe: string;
  @IsString()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsNotEmpty()
  quantity: number;
  discount: number;
  image: any;

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
