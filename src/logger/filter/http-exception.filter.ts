import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorLogger } from '../usecase/error.logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly errorLogger: ErrorLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const isException = exception instanceof HttpException;
    const error = !isException ? (exception as Error) : undefined;

    const responseBody = {
      http_status: HttpStatus.BAD_REQUEST,
      result: 'error',
      msg: '',
      code: 0,
      detail: null,
    };

    if (error) {
      responseBody.msg = error.message;
      responseBody.http_status = HttpStatus.INTERNAL_SERVER_ERROR;

      setTimeout(() => this.errorLogger.log(ctx, error), 100);
    }

    if (isException) {
      const res: any = exception.getResponse();
      const isStringResponse = typeof res === 'string';

      if (isStringResponse) {
        responseBody.msg = res;
      }

      if (!isStringResponse) {
        responseBody.msg = res.error || res.message || res.msg;
        responseBody.code = res.code;
        responseBody.http_status = exception.getStatus();
        responseBody.detail = {
          ...res,
          error: undefined,
          message: undefined,
          msg: undefined,
          code: undefined,
        };
      }
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      responseBody.http_status,
    );
  }
}
