import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { AuthCommand } from 'auth';

import { Auth } from '../models/auth';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @ApiResponse({ description: 'token', status: HttpStatus.CREATED, type: 'string' })
  @Post('login')
  login(@Body() body: Auth) {
    return this.authClient.send(AuthCommand.Login, body);
  }
}
