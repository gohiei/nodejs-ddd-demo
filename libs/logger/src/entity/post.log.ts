import * as util from 'util';
import { Entity } from '@lib/dddcore/entity';
import { DateTime, T_DATETIME_WITH_T } from '@lib/dddcore/utility/datetime';

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
  requestBody: any;
  responseData: any;

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
    this.requestBody = params?.requestBody || '-';
    this.responseData = params?.responseData || '-';

    this.maskPassword();
    this.parseResponseAsObject();
  }

  parseResponseAsObject() {
    const data = this.responseData;

    if (typeof data !== 'string') {
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      this.responseData = parsedData;
    } catch (err) {
      return;
    }
  }

  maskPassword() {
    const body = this.requestBody;
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

    this.requestBody = maskedBody;
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
      JSON.stringify(this.requestBody),
      JSON.stringify(this.responseData),
    );
  }
}
