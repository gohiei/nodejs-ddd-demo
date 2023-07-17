import { Injectable, Inject } from '@nestjs/common';
import {
  EVENT_BUS,
  DomainEvent,
  EventBus,
  EventHandler,
} from '@lib/dddcore/index';

@Injectable()
export class ClearUserCache implements EventHandler {
  readonly name: string = 'user.clear_user_cache';
  readonly eventName: string = 'user.password_changed';

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.register(this);
  }

  when(eventName: string, event: DomainEvent): Promise<void> {
    console.log(`${this.name} received ${eventName} : `, event.toJSON());
    return;
  }
}
