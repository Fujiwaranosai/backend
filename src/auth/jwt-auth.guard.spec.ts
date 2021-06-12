import { ExecutionContext } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthCommand } from 'auth';
import { expect } from 'chai';
import { ExtractJwt } from 'passport-jwt';
import { SinonSandbox } from 'sinon';

import { JwtAuthGuard } from './jwt-auth.guard';

import Chai = require('chai');
import Sinon = require('sinon');
import SinonChai = require('sinon-chai');
import { of } from 'rxjs';

Chai.use(SinonChai);

describe('JwtAuthGuard', () => {
  let app: TestingModule;
  let sandbox: SinonSandbox;

  before(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.TCP,
            }),
        },
        JwtAuthGuard,
      ],
    }).compile();
  });

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('canActivate should work', async () => {
    const authClient = app.get('AUTH_SERVICE');
    sandbox.stub(ExtractJwt, 'fromAuthHeaderAsBearerToken').returns(() => 'token');
    const sendStub = sandbox.stub(authClient, 'send').returns(of(true));
    const request = {};
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };
    const jwtAuthGuard = app.get(JwtAuthGuard);
    expect(await jwtAuthGuard.canActivate(context as ExecutionContext)).to.be.true;
    expect(sendStub).to.be.calledWith(AuthCommand.Verify.Token, { token: 'token' });
    expect(request).to.deep.eq({ user: true });
  });
});
