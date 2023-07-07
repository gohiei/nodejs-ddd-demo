import { AggregateRoot } from '@lib/dddcore/aggregate.root';
import { VerifyJwt } from '@lib/dddcore/utility/jwt';
import { InvalidRequestOccurredEvent } from './invalid_request_occurred.event';

type Request = {
  ip: string;
  xff: string;
  method: string;
  url: string;
};

export class JwtToken extends AggregateRoot {
  readonly TOKEN_KEY = 'this.is.a.token';
  readonly TOKEN_PREFIX = 'Bearer ';

  private token: string;
  private req: Request;

  constructor(token: string, request: Request) {
    super();

    this.token = token;
    this.req = request;
  }

  isValid(): [boolean, Error] {
    if (!this.token) {
      return this.returnError('Invalid Authorization');
    }

    const prefix = this.token.substring(0, this.TOKEN_PREFIX.length);
    const token = this.token.substring(this.TOKEN_PREFIX.length);

    if (prefix !== this.TOKEN_PREFIX) {
      return this.returnError('Invalid prefix');
    }

    const [, err] = VerifyJwt<object>(token, this.TOKEN_KEY);

    if (err) {
      return this.returnError(err.message);
    }

    return [true, null];
  }

  returnError(msg: string): [boolean, Error] {
    this.addDomainEvent(
      new InvalidRequestOccurredEvent(
        this.req.ip,
        this.req.xff,
        this.req.method,
        this.req.url,
        this.token,
      ),
    );

    return [false, new Error(msg)];
  }
}
