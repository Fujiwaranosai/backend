import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { SinonSandbox } from 'sinon';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { HttpExceptionFilter } from './http-exception-filter';

import Chai = require('chai');
import Sinon = require('sinon');
import SinonChai = require('sinon-chai');
import { HttpStatus } from '@nestjs/common';

Chai.use(SinonChai);

describe('HttpExceptionFilter', () => {
  let app: TestingModule;
  let sandbox: SinonSandbox;
  let httpExceptionFilter;

  before(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [HttpExceptionFilter, AppService],
    }).compile();

    httpExceptionFilter = app.get(HttpExceptionFilter);
  });

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exceptions with response and status should be caught', async () => {
    let result = null;
    const response = {
      status: (s) => ({
        json: (j) => {
          result = {
            response: j,
            status: s,
          };
        },
      }),
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    };
    const exception = { response: 'response', status: 1 };
    httpExceptionFilter.catch(exception, host);
    expect(result).to.deep.eq(exception);
  });

  it('other exceptions should be caught', async () => {
    let result = null;
    const response = {
      status: (s) => ({
        json: (j) => {
          result = {
            response: j,
            status: s,
          };
        },
      }),
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    };
    const exception = 'other exception';
    httpExceptionFilter.catch(exception, host);
    expect(result).to.deep.eq({
      response: exception,
      status: HttpStatus.BAD_REQUEST,
    });
  });
});
