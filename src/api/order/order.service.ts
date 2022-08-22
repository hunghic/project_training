import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(forwardRef(() => OrderDetailService))
    private readonly orderDetailService: OrderDetailService,
  ) {}
  async create(data: CreateOrderDto, id: any): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create({ ...data, user: id });
    const createOrder = await this.orderRepository.save(newOrder);
    if (!newOrder) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createOrder;
  }
  async acceptOrder(id: number, userId: any) {
    const order = this.findOne(id);
    const userIdFromOrder = (await order).user.id;
    if (userId === userIdFromOrder) {
      (await order).isBuy = true;
      await (await order).save();
    }
    return order;
  }

  findAll(): Promise<OrderEntity> {
    return this.orderRepository.getAll();
  }

  async findOne(id: number) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.orderRepository.findOneByCondition(id);
  }

  async update(id: any, updateOrderDto: UpdateOrderDto) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const pay = await this.orderDetailService.orderDetailSearchPrice({ order: id });
    await this.orderRepository.update(orderFound.id, { ...updateOrderDto, pay: pay });

    return this.orderRepository.findOneByCondition({ id: orderFound.id });
  }

  async remove(id: number) {
    const orderFound = await this.orderRepository.findOneByCondition(id);
    if (!orderFound) {
      return 'Not Found';
    }
    if (orderFound.isBuy === true) {
      return 'Not delete order was active';
    }
    await this.orderRepository.delete(id);
    return 'Success';
  }
}
