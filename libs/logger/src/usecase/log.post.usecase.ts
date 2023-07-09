import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { RequestDoneEvent } from '../entity/request-done.event';
import { EventBus, EventHandler } from '@lib/dddcore/event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { UseCase } from '@lib/dddcore/usecase';
import { POST_LOGGER } from '../logger.constant';
import { PostLog } from '../entity/post.log';

export type LogPostUseCaseInput = {
  at: Date;
  method: string;
  origin: string;
  status_code: number;
  content_length: number;
  domain: number;
  host: string;
  request_id: string;
  ip: string;
  request_body: any;
  response_data: any;
};

type LogPostUseCaseOutput = boolean;

@Injectable()
export class LogPostUseCase implements EventHandler, UseCase {
  readonly name = 'logger.post';
  readonly eventName = 'request.done';

  constructor(
    @Inject(POST_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  async when(eventName, event: RequestDoneEvent): Promise<void> {
    const payload = event.getPayload();
    const input: LogPostUseCaseInput = {
      ...payload,
    };

    this.execute(input);
  }

  execute(input: LogPostUseCaseInput): LogPostUseCaseOutput {
    if (input.method.toUpperCase() === 'GET') {
      return true;
    }

    const postLog = new PostLog({
      at: input.at,
      ip: input.ip,
      method: input.method,
      origin: input.origin,
      statusCode: input.status_code,
      contentLength: input.content_length,
      domain: input.domain,
      host: input.host,
      requestID: input.request_id,
      requestBody: input.request_body,
      responseData: input.response_data,
    });

    this.logger.log(postLog.toString());

    return true;
  }
}
