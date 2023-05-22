import { DomainEvent } from './domain.event';
import { Entity } from './entity';

export abstract class AggregateRoot extends Entity {
  private events: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent) {
    this.events.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return this.events;
  }
}
