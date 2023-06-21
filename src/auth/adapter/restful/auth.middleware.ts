import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { EventBus } from '@/dddcore/event.bus';
import { EVENT_BUS } from '@/dddcore/dddcore.constant';
import { Request, Response } from 'express';
import {
  CheckAuthorizationUseCase,
  CheckAuthorizationUseCaseInput,
} from '../../usecase/check.authorization.usecase';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(EVENT_BUS)
    readonly eventBus: EventBus,

    // @Inject()
    readonly usecase: CheckAuthorizationUseCase,
  ) {}
  async use(request: Request, res: Response, next: (error?: any) => void) {
    const input: CheckAuthorizationUseCaseInput = {
      token: request.get('Authorization'),
      ip: request.ip,
      xff: request.get('x-forwarded-for'),
      method: request.method,
      url: request.baseUrl,
    };

    return this.usecase
      .execute(input)
      .then(() => next())
      .catch((err) => {
        res.status(HttpStatus.FORBIDDEN).json({
          http_status: HttpStatus.FORBIDDEN,
          result: 'error',
          message: err.message,
          code: '00002',
          request_id: request.get('x-request-id'),
        });
      });
  }
}
