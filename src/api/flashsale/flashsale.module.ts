import { Module } from '@nestjs/common';
import { FlashsaleService } from './flashsale.service';
import { FlashsaleController } from './flashsale.controller';

@Module({
  controllers: [FlashsaleController],
  providers: [FlashsaleService]
})
export class FlashsaleModule {}
