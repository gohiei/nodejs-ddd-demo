import { Inject, Injectable, LoggerService } from '@nestjs/common';
import * as util from 'util';
import { DateTime } from '@/dddcore/utility/datetime';
import { RequestDoneEvent } from '../events/request-done.event';
import { POST_LOGGER } from '../logger.constant';
import { EventBus, EventHandler } from '@/dddcore/event.bus';
import { EVENT_BUS } from '@/dddcore/dddcore.constant';

@Injectable()
export class PostLogger implements EventHandler {
  readonly name = 'logger.post';
  readonly eventName = 'request.done';

  constructor(
    @Inject(POST_LOGGER) private readonly logger: LoggerService,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    eventBus.register(this);
  }

  write(message: any): void {
    this.logger.log(message);
  }

  async when(eventName, event: RequestDoneEvent): Promise<void> {
    const payload = event.getPayload();
    const { method, request_body: body, response_data: data } = payload;

    if (method.toUpperCase() === 'GET') {
      return;
    }

    const logBody = { ...body };

    const maskFields = [
      'password',
      'old_password',
      'new_password',
      'confirm_password',
      'private_key',
      'api_key',
      'public_key_content',
      'private_key_content',
    ];

    if (logBody) {
      maskFields.forEach((field) => {
        if (field in body) {
          logBody[field] = '******';
        }
      });
    }

    this.write(
      util.format(
        '%s %s "%s %s" %s %s %s %s %s Req:%s Res:%s',
        new DateTime().format(),
        payload.ip,
        payload.method,
        payload.original_url,
        payload.status_code,
        payload.content_length,
        payload.domain,
        payload.request_id,
        payload.host,
        JSON.stringify(logBody),
        JSON.stringify(data),
      ),
    );
  }
}
