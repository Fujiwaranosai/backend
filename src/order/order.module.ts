import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [AuthModule],
  providers: [
    {
      inject: [ConfigService],
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
          transport: Transport.TCP,
        }),
    },
    {
      inject: [ConfigService],
      provide: 'ORDER_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          options: {
            host: configService.get('ORDER_SERVICE_HOST'),
            port: configService.get('ORDER_SERVICE_PORT'),
          },
          transport: Transport.TCP,
        }),
    },
    JwtAuthGuard,
  ],
})
export class OrderModule {}
