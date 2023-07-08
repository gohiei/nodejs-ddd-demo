import { Response } from 'express';

export const ACCESS_LOGGER = 'ACCESS-LOGGER';
export const POST_LOGGER = 'POST-LOGGER';
export const ERROR_LOGGER = 'ERROR-LOGGER';
export const HTTP_REQUEST_LOGGER = 'HTTP-REQUEST-LOGGER';
export interface MyResponse extends Response {
  __body_response: any;
}
