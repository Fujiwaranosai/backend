import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
  controllers: [AppController],
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ProductModule, OrderModule],
  providers: [
    {
      inject: [ConfigService],
      provide: 'LOG_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          options: {
            host: configService.get('LOG_SERVICE_HOST'),
            port: configService.get('LOG_SERVICE_PORT'),
          },
          transport: Transport.TCP,
        }),
    },
    AppService,
  ],
})
export class AppModule {}
