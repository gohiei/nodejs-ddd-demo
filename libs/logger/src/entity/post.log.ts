import * as util from 'util';
import { Entity } from '@lib/dddcore/index';
import { DateTime, T_DATETIME_WITH_T } from '@lib/dddcore/utility/index';

export class PostLog extends Entity {
  at: Date = new Date();
  method: string;
  origin: string;
  statusCode: number;
  contentLength: number;
  domain: number;
  ip: string;
  host: string;
  requestID: string;
  reqBody: any;
  resBody: any;

  constructor(params: any = {}) {
    super();

    this.at = params?.at || new Date();
    this.method = params?.method || '-';
    this.origin = params?.origin || '-';
    this.statusCode = params?.statusCode || 0;
    this.contentLength = params?.contentLength || 0;
    this.domain = params?.domain || 0;
    this.ip = params?.ip || '-';
    this.host = params?.host || '-';
    this.requestID = params?.requestID || '-';
    this.reqBody = params?.reqBody || '-';
    this.resBody = params?.resBody || '-';

    this.maskPassword();
    this.parseResponseAsObject();
  }

  parseResponseAsObject() {
    const data = this.resBody;

    if (typeof data !== 'string') {
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      this.resBody = parsedData;
    } catch (err) {
      return;
    }
  }

  maskPassword() {
    const body = this.reqBody;
    const maskedBody = { ...body };

    const maskFields = [
      'password',
      'old_password',
      'new_password',
      'confirm_password',
      'private_key',
      'api_key',
      'public_key_content',
      'private_key_content',
    ];

    if (maskedBody) {
      maskFields.forEach((field) => {
        if (field in body) {
          maskedBody[field] = '******';
        }
      });
    }

    this.reqBody = maskedBody;
  }

  toJSON() {
    return {
      time: new DateTime(this.at).format(T_DATETIME_WITH_T),
      ip: this.ip,
      method: this.method,
      origin: this.origin,
      status_code: this.statusCode,
      length: this.contentLength,
      host: this.host,
      domain: this.domain,
      request_id: this.requestID,
      req_body: this.reqBody,
      res_body: this.resBody,
      extra: {},
    };
  }

  toString() {
    return util.format(
      '%s %s "%s %s" %s %s %s %s %s %s %s',
      new DateTime(this.at).format(T_DATETIME_WITH_T),
      this.ip,
      this.method,
      this.origin,
      this.statusCode,
      this.contentLength,
      this.domain,
      this.requestID,
      this.host,
      JSON.stringify(this.reqBody),
      JSON.stringify(this.resBody),
    );
  }
}
