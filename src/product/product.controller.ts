import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudService,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { ProductEntity } from 'db';
import { ProductCommand } from 'product';

@Crud({
  model: {
    type: ProductEntity,
  },
  query: {
    join: {
      branch: {
        eager: false,
      },
      color: {
        eager: false,
      },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@Controller('product')
@ApiTags('product')
export class ProductController implements CrudController<ProductEntity> {
  service: CrudService<ProductEntity>;

  constructor(@Inject('PRODUCT_SERVICE') private productClient: ClientProxy) {}

  @Override('getOneBase')
  async getOne(@ParsedRequest() request: CrudRequest) {
    return await this.productClient.send(ProductCommand.Find.One, request).toPromise();
  }

  @Override('getManyBase')
  getMany(@ParsedRequest() request: CrudRequest) {
    return this.productClient.send(ProductCommand.Find.All, request);
  }
}
