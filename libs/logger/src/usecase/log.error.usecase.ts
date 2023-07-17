import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UseCase, EventBus, EventHandler, EVENT_BUS } from '@lib/dddcore/index';
import { ERROR_LOGGER } from '../logger.constant';
import { ErrorLog } from '../entity/error.log';
import { UnexpectedErrorRaisedEvent } from '../entity/events/unexpected-error-raised.event';

export type LogErrorUseCaseInput = {
  at: Date;
  ip: string;
  method: string;
  origin: string;
  domain: number;
  request_id: string;
  host: string;
  req_body?: string;
  error?: Error;
};

type LogErrorUseCaseOutput = boolean;

@Injectable()
export class LogErrorUseCase implements EventHandler, UseCase {
  readonly name = 'logger.error';
  readonly eventName = 'unexpected_error.raised';

  constructor(
    @Inject(ERROR_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  async when(
    eventName: string,
    message: UnexpectedErrorRaisedEvent,
  ): Promise<void> {
    const payload = message.getPayload();
    const input: LogErrorUseCaseInput = {
      ...payload,
    };

    await this.execute(input);
  }

  async execute(input: LogErrorUseCaseInput): Promise<LogErrorUseCaseOutput> {
    const errorLog = new ErrorLog({
      at: input.at,
      ip: input.ip,
      method: input.method,
      origin: input.origin,
      domain: input.domain,
      requestID: input.request_id,
      host: input.host,
      error: input.error,
      reqBody: input.req_body,
    });

    this.logger.log(errorLog.toJSON());

    return true;
  }
}
