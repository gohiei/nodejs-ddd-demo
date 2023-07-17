import { DomainEvent } from '@lib/dddcore/index';

export type Payload = {
  at: Date;
  method: string;
  origin: string;
  http_version: string;
  user_agent: string;
  xff: string;
  status_code: number;
  content_length: number;
  latency: number;
  host: string;
  ip: string;
  domain: number;
  request_id: string;
  session_id?: string;
  full_path: string;
  agent?: string;
  req_body?: any;
  refer: string;
  res_body?: any;
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
