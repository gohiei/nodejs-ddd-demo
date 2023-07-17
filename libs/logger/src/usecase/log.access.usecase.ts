import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UseCase } from '@lib/dddcore/usecase';
import { EventBus, EventHandler } from '@lib/dddcore/event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { ACCESS_LOGGER } from '../logger.constant';
import { RequestDoneEvent } from '../entity/events/request-done.event';
import { AccessLog } from '../entity/access.log';

export type LogAccessUseCaseInput = {
  at: Date;
  method: string;
  origin: string;
  http_version: string;
  user_agent: string;
  xff: string;
  status_code: number;
  content_length: number;
  latency: number;
  domain: number;
  host: string;
  request_id: string;
  ip: string;
  full_path: string;
  session_id?: string;
  agent?: string;
};

export type LogAccessUseCaseOutput = boolean;

@Injectable()
export class LogAccessUseCase implements EventHandler, UseCase {
  name = 'logger.access';
  eventName = 'request.done';

  constructor(
    @Inject(ACCESS_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  async when(eventName: string, event: RequestDoneEvent): Promise<void> {
    const payload = event.getPayload();
    const input: LogAccessUseCaseInput = {
      ...payload,
    };
    await this.execute(input);
  }

  async execute(input: LogAccessUseCaseInput): Promise<LogAccessUseCaseOutput> {
    const accessLog = new AccessLog({
      at: input.at,
      ip: input.ip,
      method: input.method,
      origin: input.origin,
      httpVersion: input.http_version,
      userAgent: input.user_agent,
      xff: input.xff,
      statusCode: input.status_code,
      contentLength: input.content_length,
      latency: input.latency,
      domain: input.domain,
      host: input.host,
      requestID: input.request_id,
      fullPath: input.full_path,
      sessionID: input.session_id,
      agent: input.agent,
    });

    this.logger.log(accessLog.toJSON());

    return true;
  }
}
