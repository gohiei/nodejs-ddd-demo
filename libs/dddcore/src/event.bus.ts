import { AggregateRoot } from './aggregate.root';
import { DomainEvent } from './domain.event';

export interface EventBus {
  post(event: DomainEvent): Promise<void>;
  postAll(ar: AggregateRoot): Promise<void>;
  register(handler: EventHandler): void;
  unregister(handler: EventHandler): void;
}

export interface EventHandler {
  readonly name: string;
  readonly eventName: string;

  when(eventName: string, message: DomainEvent): Promise<void>;
}
