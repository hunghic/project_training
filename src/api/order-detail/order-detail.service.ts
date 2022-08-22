import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { UpdateOrderDto } from '../order/dto/update-order.dto';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetailRepository } from './order-detail.repository';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}
  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const newOrderDetail = this.orderDetailRepository.create(createOrderDetailDto);
    const priceProduct = this.productService.getPrice(newOrderDetail.product);
    const idOrder = newOrderDetail.order;
    const quantity = newOrderDetail.quantity;
    const price = (await priceProduct) * quantity;
    const createOrderDetail = await this.orderDetailRepository.save({ ...newOrderDetail, price: price });
    await this.orderService.update(idOrder, UpdateOrderDto);
    if (!newOrderDetail) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createOrderDetail;
  }

  findAll() {
    return `This action returns all orderDetail`;
  }
  async orderDetailSearchPrice(conditions: unknown) {
    const list = await this.orderDetailRepository.searchOrderDetail(conditions);
    const priceArr = list.map((od) => od.price);
    let price = 0;
    for (let i = 0; i < priceArr.length; i++) {
      price += priceArr[i];
    }
    return price;
  }
  async getPrice(id: number) {
    const productFound = await this.orderDetailRepository.findOneByCondition(id);
    if (!productFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return (await this.orderDetailRepository.findOneByCondition(id)).price;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  async remove(id: number) {
    const orderDetailFound = await this.orderDetailRepository.findOneByCondition(id);
    const orderId = orderDetailFound.order.id;
    await this.orderDetailRepository.delete(id);
    await this.orderService.update(orderId, UpdateOrderDto);
    if (!orderDetailFound) {
      return 'Not Found';
    }
    return 'Success';
  }
}
