import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthCommand } from 'auth';

import { Auth } from '../models/auth';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('login')
  login(@Body() body: Auth) {
    return this.authClient.send(AuthCommand.Login, body);
  }
}
