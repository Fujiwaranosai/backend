import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthCommand } from 'auth';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const result = await this.authClient.send(AuthCommand.Verify.Token, { token }).toPromise();
    if (result) {
      request.user = result;
    }
    return result;
  }
}
