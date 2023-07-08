import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UUID } from '@lib/dddcore/utility/uuid';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const requestId = req.get('x-request-id');

    if (!requestId) {
      req.headers['x-request-id'] = UUID.new().toString();
    }

    const res = context.switchToHttp().getResponse<Response>();
    res.set('x-request-id', req.get('x-request-id'));

    return next.handle();
  }
}
