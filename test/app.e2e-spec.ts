import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/filters/http-exception-filter';

import Chai = require('chai');
import SinonChai = require('sinon-chai');
import Faker = require('faker');

Chai.use(SinonChai);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  before(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  after(async () => {
    await app.close();
  });

  it('/product (GET) should work', async () => {
    const response = await request(app.getHttpServer()).get('/product').expect(HttpStatus.OK);
    expect(response.body).to.be.an('array');
  });

  it('/product/:id (GET) should work', async () => {
    const productsResponse = await request(app.getHttpServer())
      .get('/product')
      .expect(HttpStatus.OK);
    const firstProduct = productsResponse.body[0];
    const response = await request(app.getHttpServer())
      .get(`/product/${firstProduct.id}`)
      .expect(HttpStatus.OK);
    expect(response.body).to.deep.eq(firstProduct);
  });

  it('/product?s (GET) search should work', async () => {
    // Search name starts with pi
    const query = { name: { $starts: 'pi' } };
    await request(app.getHttpServer())
      .get(`/product?s=${JSON.stringify(query)}`)
      .expect(HttpStatus.OK);
  });

  it('/product/:id (GET) should fail if not found', async () => {
    await request(app.getHttpServer()).get('/product/0').expect(HttpStatus.NOT_FOUND);
  });

  it('/order (POST) should work if authorized', async () => {
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: Faker.random.word(),
        username: Faker.random.word(),
      })
      .expect(HttpStatus.CREATED);
    const token = authResponse.text;

    const productsResponse = await request(app.getHttpServer())
      .get('/product')
      .expect(HttpStatus.OK);
    const firstProduct = productsResponse.body[0];

    await request(app.getHttpServer())
      .post('/order')
      .auth(token, { type: 'bearer' })
      .send({
        agentId: 1,
        orderInfo: Faker.random.words(),
        products: [{ id: firstProduct.id }],
      })
      .expect(HttpStatus.CREATED);
  });

  it('/order (POST) should fail if product id is not found', async () => {
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: Faker.random.word(),
        username: Faker.random.word(),
      })
      .expect(HttpStatus.CREATED);
    const token = authResponse.text;

    await request(app.getHttpServer())
      .post('/order')
      .auth(token, { type: 'bearer' })
      .send({
        agentId: 1,
        orderInfo: Faker.random.words(),
        products: [{ id: 0 }],
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/order (POST) should fail if not authorized', async () => {
    await request(app.getHttpServer())
      .post('/order')
      .send({
        agentId: 1,
        orderInfo: Faker.random.words(),
        products: [{ id: 1 }],
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
