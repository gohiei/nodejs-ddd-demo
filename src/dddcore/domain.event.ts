import { UUID } from './utility/uuid';

export abstract class DomainEvent {
  private id: string;
  private occurredOn = new Date();
  private name: string;

  constructor(name: string) {
    this.id = UUID.new().toString();
    this.occurredOn = new Date();
    this.name = name;
  }

  getID(): string {
    return this.id;
  }

  getOccurredOn(): Date {
    return this.occurredOn;
  }

  getName(): string {
    return this.name;
  }

  toJSON(): object {
    return {
      id: this.id,
      occurred_on: this.occurredOn,
      name: this.name,
    };
  }
}
