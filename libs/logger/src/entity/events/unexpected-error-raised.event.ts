import { DomainEvent } from '@lib/dddcore/index';

export type Payload = {
  at: Date;
  ip: string;
  request_id: string;
  host: string;
  domain: number;
  method: string;
  origin: string;
  req_body?: string;
  error?: Error;
};

export class UnexpectedErrorRaisedEvent extends DomainEvent {
  payload: Payload;

  constructor(payload: Payload) {
    super('unexpected_error.raised');

    this.payload = payload;
  }

  getPayload() {
    return this.payload;
  }
}
