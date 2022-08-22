import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
// import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/share/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { RoleGuard } from 'src/share/auth/guards/role.guard';
import { Roles } from 'src/share/auth/decorator/role.decorator';
import { Role } from '../user/role.enum';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const id = req.user.id;
    return this.orderService.create(createOrderDto, id);
  }
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @Get('accept/:id')
  acceptOrder(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    return this, this.orderService.acceptOrder(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  // // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async profile(@Req() request) {
  //   return request.user.id;
  // }
}
