import { DomainEvent } from '@lib/dddcore/domain.event';

export class InvalidRequestOccurredEvent extends DomainEvent {
  private readonly ip: string;
  private readonly xff: string;
  private readonly method: string;
  private readonly url: string;
  private readonly token: string;

  constructor(
    ip: string,
    xff: string,
    method: string,
    url: string,
    token: string,
  ) {
    super('invalid_request.occurred');

    this.ip = ip;
    this.xff = xff;
    this.method = method;
    this.url = url;
    this.token = token;
  }
}
