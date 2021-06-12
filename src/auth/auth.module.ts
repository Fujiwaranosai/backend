import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  controllers: [AuthController],
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
    JwtAuthGuard,
  ],
})
export class AuthModule {}
