import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { ProductCommand } from 'product';
import { SinonSandbox } from 'sinon';

import { ProductController } from './product.controller';

import Chai = require('chai');
import Sinon = require('sinon');
import SinonChai = require('sinon-chai');

Chai.use(SinonChai);

describe('ProductController', () => {
  let app: TestingModule;
  let sandbox: SinonSandbox;

  before(async () => {
    app = await Test.createTestingModule({
      controllers: [ProductController],
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
          provide: 'PRODUCT_SERVICE',
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

  it('getOne should work', () => {
    const productClient = app.get('PRODUCT_SERVICE');
    const sendSpy = sandbox.spy(productClient, 'send');
    const productController = app.get(ProductController);
    const request = { options: {}, parsed: null };
    productController.getOne(request);
    expect(sendSpy).to.be.calledWith(ProductCommand.Find.One, request);
  });

  it('getAll should work', () => {
    const productClient = app.get('PRODUCT_SERVICE');
    const sendSpy = sandbox.spy(productClient, 'send');
    const productController = app.get(ProductController);
    const request = { options: {}, parsed: null };
    productController.getMany(request);
    expect(sendSpy).to.be.calledWith(ProductCommand.Find.All, request);
  });
});
