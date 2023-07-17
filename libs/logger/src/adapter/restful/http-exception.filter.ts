import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { Exception, EventBus, EVENT_BUS } from '@lib/dddcore/index';
import { UnexpectedErrorRaisedEvent } from '../../entity/events/unexpected-error-raised.event';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(EVENT_BUS) readonly eventBus: EventBus,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const req = ctx.getRequest<Request>();

    const isException = exception instanceof Exception;
    const error = !isException ? (exception as Error) : undefined;

    const responseBody = {
      result: 'error',
      message: '',
      code: '-',
      request_id: req.get('x-request-id'),
      http_status_code: HttpStatus.BAD_REQUEST,
    };

    // Unexpected Error
    if (error) {
      responseBody.message = error.message;
      responseBody.http_status_code = HttpStatus.INTERNAL_SERVER_ERROR;

      this.eventBus.post(
        new UnexpectedErrorRaisedEvent({
          at: new Date(),
          ip: req.ip,
          request_id: req.get('x-request-id'),
          method: req.method,
          origin: req.originalUrl,
          domain: Number(req.get('domain')),
          host: req.get('host'),
          error,
          req_body: req.body,
        }),
      );
    }

    // Expected Error
    if (isException) {
      responseBody.message = exception.message;
      responseBody.code = exception.code;
      responseBody.http_status_code = exception.statusCode;
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      responseBody.http_status_code,
    );
  }
}
