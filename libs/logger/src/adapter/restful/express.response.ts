import { Response } from 'express';
import { Stream } from 'stream';

export interface ExtendedExpressResponse extends Response {
  __body_response: any;
}

// Fork from Koa's Response
// @link https://github.com/koajs/koa/blob/master/lib/response.js#L212
export function getContentLength(res: ExtendedExpressResponse): number {
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
