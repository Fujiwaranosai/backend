import { RpcException } from '@nestjs/microservices';

export class ValidationException extends RpcException {
  constructor(errors) {
    super({ errors, validationError: true });
  }
}
