import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '../aggregate.root';
import { DomainEvent } from '../domain.event';
import { EventBus, EventHandler } from '../event.bus';

@Injectable()
export class FakeEventBus implements EventBus {
  static _instance: FakeEventBus;

  constructor() {
    if (FakeEventBus._instance) {
      return FakeEventBus._instance;
    }

    FakeEventBus._instance = this;
  }

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
