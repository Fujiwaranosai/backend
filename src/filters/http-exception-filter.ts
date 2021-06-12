import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception.status && exception.response) {
      response.status(exception.status).json(exception.response);
    } else {
      response.status(HttpStatus.BAD_REQUEST).json(exception);
    }
  }
}
