import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { OrderEntity } from 'db';
import { OrderCommand } from 'order';
import { SinonSandbox } from 'sinon';

import { OrderController } from './order.controller';

import Chai = require('chai');
import Sinon = require('sinon');
import SinonChai = require('sinon-chai');

Chai.use(SinonChai);

describe('OrderController', () => {
  let app: TestingModule;
  let sandbox: SinonSandbox;

  before(async () => {
    app = await Test.createTestingModule({
      controllers: [OrderController],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'secret',
        }),
      ],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.TCP,
            }),
        },
        {
          provide: 'ORDER_SERVICE',
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.TCP,
            }),
        },
      ],
    }).compile();
  });

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('createOne should work', () => {
    const orderClient = app.get('ORDER_SERVICE');
    const sendSpy = sandbox.spy(orderClient, 'send');
    const orderController = app.get(OrderController);
    const request = { options: {}, parsed: null };
    const orderDto = new OrderEntity();
    orderController.createOne(request, orderDto);
    expect(sendSpy).to.be.calledWith(OrderCommand.From.Call, {
      body: orderDto,
      request,
    });
  });
});
