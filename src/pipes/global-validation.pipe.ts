import { Injectable, ValidationPipe } from '@nestjs/common';

import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => new ValidationException(errors),
      transform: true,
      whitelist: true,
    });
  }
}
