import * as util from 'util';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { EventBus, EventHandler } from '../../dddcore/event.bus';
import { EVENT_BUS } from '../../dddcore/dddcore.constant';
import { DateTime } from '../../dddcore/utility/datetime';
import { ACCESS_LOGGER } from '../logger.constant';
import { RequestDoneEvent } from '../events/request-done.event';

@Injectable()
export class AccessLogger implements EventHandler {
  name = 'logger.access';
  eventName = 'request.done';

  constructor(
    @Inject(ACCESS_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  write(message: any): void {
    this.logger.log(message);
  }

  async when(eventName: string, event: RequestDoneEvent): Promise<void> {
    const payload = event.getPayload();

    this.write(
      util.format(
        '%s %s "%s %s HTTP/%s" "%s" "%s" %s %s %s %s %s %s',
        new DateTime().format(),
        payload.ip,
        payload.method,
        payload.original_url,
        payload.http_version,
        payload.user_agent,
        payload.x_forwarded_for,
        payload.status_code,
        payload.content_length,
        payload.time,
        payload.domain,
        payload.host,
        payload.request_id,
      ),
    );
  }
}
