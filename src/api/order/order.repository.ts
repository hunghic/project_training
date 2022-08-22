import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from 'src/share/database/typeorm.repository';
import { ORDER_CONST } from './order.constant';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderRepository extends TypeOrmRepository<OrderEntity> {
  constructor(
    @Inject(ORDER_CONST.MODEL_PROVIDER)
    orderEntity: Repository<OrderEntity>,
  ) {
    super(orderEntity);
  }
}
