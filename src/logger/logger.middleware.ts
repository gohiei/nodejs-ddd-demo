import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { MyResponse } from './logger.constant';
import { RequestDoneEvent } from './events/request-done.event';
import { EventBus } from '@/dddcore/event.bus';
import { EVENT_BUS } from '@/dddcore/dddcore.constant';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(EVENT_BUS)
    readonly eventBus: EventBus,
  ) {}

  use(req: Request, res: MyResponse, next: () => void) {
    const originalSend = res.send;

    res.send = function (body) {
      res.__body_response = body;
      return originalSend.call(this, body);
    };

    const begin = new Date();

    res.on('close', () => {
      const end = new Date();
      const time = end.getTime() - begin.getTime();

      this.eventBus.post(new RequestDoneEvent(time, req, res));
    });

    next();
  }
}
