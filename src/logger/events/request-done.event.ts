import { MyResponse } from '../logger.constant';
import { Request } from 'express';
import { Stream } from 'stream';
import { DomainEvent } from '../../dddcore/domain.event';

export class RequestDoneEvent extends DomainEvent {
  private readonly payload: any;

  constructor(time: number, req: Request, res: MyResponse) {
    super('request.done');

    this.payload = {
      user_agent: req.get('user-agent') || '-',
      x_forwarded_for: req.get('x-forwarded-for') || '-',
      request_id: req.get('requestId') || '-',
      host: req.get('host') || '-',
      domain: req.get('domain') || '-',
      status_code: res.statusCode,
      content_length: this.getContentLength(res),
      time,
      ip: req.ip,
      method: req.method,
      original_url: req.originalUrl,
      request_body: req.body,
      response_data: res.__body_response,
      http_version: req.httpVersion,
    };
  }

  getPayload() {
    return this.payload;
  }

  // Fork from Koa's Response
  // @link https://github.com/koajs/koa/blob/master/lib/response.js#L212
  getContentLength(res: MyResponse): number {
    if (res.hasHeader('content-length')) {
      return parseInt(res.get('content-length'), 10) || 0;
    }

    const { __body_response: body } = res;

    if (!body || body instanceof Stream) {
      return undefined;
    }

    if ('string' === typeof body) {
      return Buffer.byteLength(body);
    }

    if (Buffer.isBuffer(body)) {
      return body.length;
    }

    return Buffer.byteLength(JSON.stringify(body));
  }
}
