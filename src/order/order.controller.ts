import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudService,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { OrderEntity } from 'db';
import { OrderCommand } from 'order';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: OrderEntity,
  },
  routes: {
    only: ['createOneBase'],
  },
})
@UseGuards(JwtAuthGuard)
@Controller('order')
@ApiTags('order')
@ApiBearerAuth()
export class OrderController implements CrudController<OrderEntity> {
  service: CrudService<OrderEntity>;

  constructor(@Inject('ORDER_SERVICE') private orderClient: ClientProxy) {}

  @Override('createOneBase')
  createOne(@ParsedRequest() request: CrudRequest, @ParsedBody() orderDto: OrderEntity) {
    return this.orderClient.send(OrderCommand.From.Call, {
      body: orderDto,
      request,
    });
  }
}
