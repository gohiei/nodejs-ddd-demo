import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { Exception } from '@lib/dddcore/error';
import {
  LogErrorUseCase,
  LogErrorUseCaseInput,
} from '../../usecase/log.error.usecase';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logErrorUseCase: LogErrorUseCase,
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

    // Unexpected Error
    if (error) {
      responseBody.message = error.message;
      responseBody.http_status = HttpStatus.INTERNAL_SERVER_ERROR;

      setTimeout(() => {
        const input: LogErrorUseCaseInput = {
          at: new Date(),
          ip: req.ip,
          method: req.method,
          origin: req.originalUrl,
          domain: Number(req.get('domain')),
          request_id: req.get('x-request-id'),
          host: req.get('host'),
          error,
        };
        this.logErrorUseCase.execute(input);
      }, 100);
    }

    // Expected Error
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
