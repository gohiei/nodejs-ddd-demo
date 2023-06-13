import { HttpStatus } from '@nestjs/common';

export class Exception extends Error {
  code: string;
  statusCode: number = HttpStatus.BAD_REQUEST;
  detail: string;
  previous: Error;

  constructor(msg: string) {
    super(msg);
  }

  static New(code: string, msg: string): Exception {
    const e = new Exception(msg);
    e.code = code;

    return e;
  }

  static NewS(code: string, msg: string, statusCode: number): Exception {
    const e = new Exception(msg);
    e.code = code;
    e.statusCode = statusCode;

    return e;
  }

  static NewI(code: string, msg: string): Exception {
    return Exception.NewS(code, msg, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static NewBy(error: Error): Exception {
    if (error instanceof Exception) {
      return error;
    }

    return Exception.NewI('-', error.message);
  }
}
