import { DomainEvent } from '@lib/dddcore/domain.event';

export type Payload = {
  at: Date;
  user_agent: string;
  xff: string;
  request_id: string;
  host: string;
  domain: number;
  ip: string;
  method: string;
  origin: string;
  http_version: string;
  request_body: any;
  refer: string;
  full_path: string;
  status_code: number;
  content_length: number;
  latency: number;
  response_data: any;
};

export class RequestDoneEvent extends DomainEvent {
  payload: Payload;

  constructor(payload: Payload) {
    super('request.done');

    this.payload = payload;
  }

  getPayload() {
    return this.payload;
  }
}
