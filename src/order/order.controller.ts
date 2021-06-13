import { Controller, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudService,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { OrderEntity, ProductEntity } from 'db';
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

  @ApiBody({
    schema: {
      properties: {
        agentId: { type: 'number' },
        orderInfo: { type: 'string' },
        products: {
          items: { properties: { id: { type: 'number' } }, type: 'object' },
          type: 'array',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OmitType(OrderEntity, ['products']),
  })
  @Override('createOneBase')
  createOne(@ParsedRequest() request: CrudRequest, @ParsedBody() orderDto: OrderEntity) {
    return this.orderClient.send(OrderCommand.From.Call, {
      body: orderDto,
      request,
    });
  }
}
