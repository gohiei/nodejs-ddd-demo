import { DomainEvent } from '@lib/dddcore/domain.event';

export type Payload = {
  at: Date;
  method: string;
  origin: string;
  host: string;
  req_header: string;
  req_body?: string;
  status_code?: number;
  latency?: number;
  error?: Error;
  res_header?: string;
  res_body?: string;
};

export class HTTPRequestDoneEvent extends DomainEvent {
  payload: Payload;

  constructor(payload: Payload) {
    super('http_request.done');

    this.payload = payload;
  }

  getPayload() {
    return this.payload;
  }
}
