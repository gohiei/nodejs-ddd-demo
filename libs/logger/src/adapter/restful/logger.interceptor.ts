import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { UUID } from '@lib/dddcore/utility/index';
import { RealClientIP } from './real.client.ip';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(readonly realClientIP: RealClientIP) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const hasError = this.realClientIP.parse(context);

    if (hasError) {
      return;
    }

    this.setRequestID(context);

    return next.handle();
  }

  setRequestID(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const requestId = req.get('x-request-id');

    if (!requestId) {
      req.headers['x-request-id'] = UUID.new().toString();
    }

    const res = context.switchToHttp().getResponse<Response>();
    res.set('x-request-id', req.get('x-request-id'));
  }
}
