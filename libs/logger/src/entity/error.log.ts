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
  }

  toString() {
    return util.format(
      '%s %s "%s %s" %s %s %s "%s" %s',
      new DateTime(this.at).format(),
      this.ip,
      this.method,
      this.origin,
      this.domain,
      this.requestID,
      this.host,
      this.error?.message,
      JSON.stringify(this.error?.stack),
    );
  }
}
