import { DomainEvent } from '../../dddcore/domain.event';
import { EventBus, EventHandler } from '../../dddcore/event.bus';

export class NotifyManagerHandler implements EventHandler {
  readonly name: string = 'notify.manager';
  readonly eventName: string = 'user.renamed';

  constructor(eventBus: EventBus) {
    eventBus.register(this);
  }

  when(eventName: string, event: DomainEvent): Promise<void> {
    console.log('Received: ', eventName, event.toJSON());
    return;
  }
}
