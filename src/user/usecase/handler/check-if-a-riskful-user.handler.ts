import { Injectable, Inject } from '@nestjs/common';
import { EVENT_BUS } from '@/dddcore/dddcore.constant';
import { DomainEvent } from '@/dddcore/domain.event';
import { EventBus, EventHandler } from '@/dddcore/event.bus';

@Injectable()
export class CheckIfARiskFulUser implements EventHandler {
  readonly name: string = 'user.check_if_a_riskful_user';
  readonly eventName: string = 'user.password_changed';

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.register(this);
  }

  when(eventName: string, event: DomainEvent): Promise<void> {
    console.log(`${this.name} received ${eventName} : `, event.toJSON());
    // 列入高風險
    return;
  }
}
