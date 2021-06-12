import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    {
      inject: [ConfigService],
      provide: 'PRODUCT_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          options: {
            host: configService.get('PRODUCT_SERVICE_HOST'),
            port: configService.get('PRODUCT_SERVICE_PORT'),
          },
          transport: Transport.TCP,
        }),
    },
  ],
})
export class ProductModule {}
