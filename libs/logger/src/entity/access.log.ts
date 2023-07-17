import { Entity } from '@lib/dddcore/entity';
import { DateTime, T_DATETIME_WITH_T } from '@lib/dddcore/utility/datetime';
import * as util from 'util';

export class AccessLog extends Entity {
  at: Date;
  method: string;
  origin: string;
  httpVersion: string;
  userAgent: string;
  xff: string;
  statusCode: number;
  contentLength: number;
  latency: number;
  host: string;
  ip: string;
  domain: number;
  requestID: string;
  sessionID: string;
  fullPath: string;
  agent: string;

  constructor(params: any = {}) {
    super();

    this.at = params?.at || new Date();
    this.method = params?.method || '-';
    this.origin = params?.origin || '-';
    this.httpVersion = params?.httpVersion || '-';
    this.userAgent = params?.userAgent || '-';
    this.xff = params?.xff || '-';
    this.statusCode = params?.statusCode || 0;
    this.contentLength = params?.contentLength || 0;
    this.latency = params?.latency || 0;
    this.host = params?.host || '-';
    this.ip = params?.ip || '-';
    this.domain = params?.domain || 0;
    this.requestID = params?.requestID || '-';
    this.sessionID = params?.sessionID || '-';
    this.fullPath = params?.fullPath || '-';
    this.agent = params?.agent || '-';
  }

  toJSON() {
    return {
      time: new DateTime(this.at).format(T_DATETIME_WITH_T),
      method: this.method,
      origin: this.origin,
      version: this.httpVersion,
      user_agent: this.userAgent,
      xff: this.xff,
      status_code: this.statusCode,
      length: this.contentLength,
      latency: this.latency,
      host: this.host,
      ip: this.ip,
      domain: this.domain,
      request_id: this.requestID,
      session_id: this.sessionID,
      full_path: this.fullPath,
      agent: this.agent,
      extra: {},
    };
  }

  toString(): string {
    return util.format(
      '%s %s "%s %s HTTP/%s" "%s" "%s" %s %s %s %s %s %s "%s"',
      new DateTime(this.at).format(T_DATETIME_WITH_T),
      this.ip,
      this.method,
      this.origin,
      this.httpVersion,
      this.userAgent,
      this.xff,
      this.statusCode,
      this.contentLength,
      this.latency,
      this.domain,
      this.host,
      this.requestID,
      this.fullPath,
    );
  }
}
