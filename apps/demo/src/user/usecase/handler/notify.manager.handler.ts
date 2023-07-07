import { Inject, Injectable } from '@nestjs/common';
import { DomainEvent } from '@lib/dddcore/domain.event';
import { EventBus, EventHandler } from '@lib/dddcore/event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';

@Injectable()
export class NotifyManagerHandler implements EventHandler {
  readonly name: string = 'notify.manager';
  readonly eventName: string = 'user.renamed';

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.register(this);
  }

  when(eventName: string, event: DomainEvent): Promise<void> {
    console.log('Received: ', eventName, event.toJSON());
    return;
  }
}
