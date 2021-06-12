import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthCommand } from 'auth';
import { expect } from 'chai';
import { SinonSandbox } from 'sinon';

import { AppService } from '../app.service';
import { Auth } from '../models/auth';
import { AuthController } from './auth.controller';

import Chai = require('chai');
import Sinon = require('sinon');
import SinonChai = require('sinon-chai');
import Faker = require('faker');

Chai.use(SinonChai);

describe('AuthController', () => {
  let app: TestingModule;
  let sandbox: SinonSandbox;

  before(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
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
        AppService,
      ],
    }).compile();
  });

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('login should work', () => {
    const authClient = app.get('AUTH_SERVICE');
    const sendSpy = sandbox.spy(authClient, 'send');
    const authController = app.get(AuthController);
    const auth = new Auth();
    auth.username = Faker.random.word();
    auth.password = Faker.random.word();
    authController.login(auth);
    expect(sendSpy).to.be.calledWith(AuthCommand.Login, auth);
  });
});
