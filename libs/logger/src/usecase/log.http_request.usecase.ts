import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { EventBus, EventHandler, EVENT_BUS } from '@lib/dddcore/index';
import { HTTP_REQUEST_LOGGER } from '../logger.constant';
import { HTTPRequestLog } from '../entity/http_request.log';
import {
  HTTPRequestDoneEvent,
  Payload,
} from '../entity/events/http-request-done.event';

export type LogHTTPRequestUseCaseInput = Payload;

type LogHTTPRequestUseCaseOutput = boolean;

@Injectable()
export class LogHTTPRequestUseCase implements EventHandler {
  readonly name = 'logger.http_request';
  readonly eventName = 'http_request.done';

  constructor(
    @Inject(HTTP_REQUEST_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  async when(eventName, event: HTTPRequestDoneEvent): Promise<void> {
    const payload = event.getPayload();
    const input: LogHTTPRequestUseCaseInput = {
      ...payload,
    };

    this.execute(input);
  }

  execute(input: LogHTTPRequestUseCaseInput): LogHTTPRequestUseCaseOutput {
    const log = new HTTPRequestLog({
      at: input.at,
      method: input.method,
      origin: input.origin,
      host: input.host,
      reqHeader: input.req_header,
      reqBody: input.req_body,
      statusCode: input.status_code,
      latency: input.latency,
      error: input.error,
      resHeader: input.res_header,
      resBody: input.res_body,
    });

    this.logger.log(log.toJSON());

    return true;
  }
}
