import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorLogger } from '../../usecase/error.logger';
import { Exception } from '@/dddcore/error';
import { Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly errorLogger: ErrorLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const req = ctx.getRequest<Request>();

    const isException = exception instanceof Exception;
    const error = !isException ? (exception as Error) : undefined;

    const responseBody = {
      http_status: HttpStatus.BAD_REQUEST,
      result: 'error',
      message: '',
      code: '',
      request_id: req.get('x-request-id'),
    };

    if (error) {
      responseBody.message = error.message;
      responseBody.http_status = HttpStatus.INTERNAL_SERVER_ERROR;

      setTimeout(() => this.errorLogger.log(ctx, error), 100);
    }

    if (isException) {
      responseBody.message = exception.message;
      responseBody.code = exception.code;
      responseBody.http_status = exception.statusCode;
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      responseBody.http_status,
    );
  }
}
