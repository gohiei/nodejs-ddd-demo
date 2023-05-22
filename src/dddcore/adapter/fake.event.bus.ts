import { AggregateRoot } from '../aggregate.root';
import { DomainEvent } from '../domain.event';
import { EventBus, EventHandler } from '../event.bus';

export class FakeEventBus implements EventBus {
  post(event: DomainEvent): void {
    console.log(event.getName());
  }

  postAll(ar: AggregateRoot): void {
    ar.getDomainEvents().forEach((event) => {
      this.post(event);
    });
  }

  register(handler: EventHandler): void {
    console.log(handler.name);
  }

  unregister(handler: EventHandler): void {
    console.log(handler.name);
  }
}
