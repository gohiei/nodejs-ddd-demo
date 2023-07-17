import * as util from 'util';
import { Entity } from '@lib/dddcore/entity';
import { DateTime } from '@lib/dddcore/utility/datetime';

export class ErrorLog extends Entity {
  at: Date;
  method: string;
  origin: string;
  domain: number;
  host: string;
  ip: string;
  requestID: string;
  error: Error;
  reqBody: string;

  constructor(params: any = {}) {
    super();

    this.at = params?.at || new Date();
    this.method = params?.method || '-';
    this.origin = params?.origin || '-';
    this.domain = params?.domain || 0;
    this.host = params?.host || '-';
    this.requestID = params?.requestID || '-';
    this.ip = params?.ip || '-';
    this.error = params?.error || '-';
    this.reqBody = params?.reqBody || '-';
  }

  toString() {
    return util.format(
      '%s %s "%s %s" %s %s %s %s "%s" %s',
      new DateTime(this.at).format(),
      this.ip,
      this.method,
      this.origin,
      this.domain,
      this.requestID,
      this.host,
      JSON.stringify(this.reqBody),
      this.error?.message,
      JSON.stringify(this.error?.stack),
    );
  }

  toJSON() {
    return {
      time: new DateTime(this.at).format(),
      method: this.method,
      origin: this.origin,
      domain: this.domain,
      host: this.host,
      request_id: this.requestID,
      ip: this.ip,
      req_body: this.reqBody,
      error: this.error,
    };
  }
}
