import * as util from 'util';
import { Entity } from '@lib/dddcore/entity';
import { DateTime, T_DATETIME_WITH_T } from '@lib/dddcore/utility/datetime';

export class HTTPRequestLog extends Entity {
  at: Date;
  method: string;
  origin: string;
  host: string;
  reqHeader: string;
  reqBody: string;
  statusCode: number;
  latency: number;
  error: Error;
  resHeader: string;
  resBody: string;

  constructor(params: any = {}) {
    super();

    this.at = params?.at || new Date();
    this.method = params?.method || '-';
    this.origin = params?.origin || '-';
    this.host = params?.host || '-';
    this.reqHeader = params?.reqHeader || '-';
    this.reqBody = params?.reqBody || '-';
    this.statusCode = params?.statusCode || 0;
    this.latency = params?.latency || 0;
    this.error = params?.error;
    this.resHeader = params?.resHeader || '-';
    this.resBody = params?.resBody || '-';
  }

  toString() {
    return util.format(
      '%s "%s %s" %s %s %s %d %d %s %s',
      new DateTime(this.at).format(T_DATETIME_WITH_T),
      this.method,
      this.origin,
      this.host,
      JSON.stringify(this.reqHeader),
      JSON.stringify(this.reqBody),
      this.statusCode,
      this.latency,
      JSON.stringify(this.resHeader),
      JSON.stringify(this.resBody),
    );
  }
}
