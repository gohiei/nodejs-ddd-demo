import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { ExtendedExpressResponse, getContentLength } from './express.response';
import { RequestDoneEvent } from '../../entity/request-done.event';
import { EventBus } from '@lib/dddcore/event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(EVENT_BUS)
    readonly eventBus: EventBus,
  ) {}

  use(req: Request, res: ExtendedExpressResponse, next: () => void) {
    const originalSend = res.send;

    res.send = function (body) {
      res.__body_response = body;
      return originalSend.call(this, body);
    };

    const begin = new Date();

    res.on('close', () => {
      const end = new Date();
      const latency = end.getTime() - begin.getTime();

      this.eventBus.post(
        new RequestDoneEvent({
          at: new Date(),

          // Request
          user_agent: req.get('user-agent'),
          xff: req.get('x-forwarded-for'),
          request_id: req.get('x-request-id'),
          host: req.get('host'),
          domain: Number(req.get('domain')),
          ip: req.ip,
          method: req.method,
          origin: req.originalUrl,
          http_version: req.httpVersion,
          full_path: `${req.method} ${req.route?.path}`,
          request_body: req.body,
          refer: req.get('referer'),

          // Response
          response_data: res.__body_response,
          status_code: res.statusCode,
          content_length: getContentLength(res),
          latency,
        }),
      );
    });

    next();
  }
}
