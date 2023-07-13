import { EventEmitter2 } from 'eventemitter2';
import { AggregateRoot } from '../aggregate.root';
import { DomainEvent } from '../domain.event';
import { EventBus, EventHandler } from '../event.bus';
import { Injectable } from '@nestjs/common';
@Injectable()
export class EventEmitter2EventBus implements EventBus {
  static _instance: EventEmitter2EventBus;
  private emitter: EventEmitter2;

  constructor() {
    if (EventEmitter2EventBus._instance) {
      return EventEmitter2EventBus._instance;
    }

    this.emitter = new EventEmitter2({
      wildcard: true,
    });

    EventEmitter2EventBus._instance = this;
  }

  async post(event: DomainEvent): Promise<void> {
    await this.emitter.emitAsync(event.getName(), event);
  }

  postAll(ar: AggregateRoot): void {
    ar.getDomainEvents().forEach((event) => {
      this.post(event);
    });
  }

  register(handler: EventHandler): void {
    this.emitter.addListener(handler.eventName, async (event: DomainEvent) => {
      await handler.when(event.getName(), event);
    });
  }

  unregister(handler: EventHandler): void {
    console.log(handler.name);
  }
}
