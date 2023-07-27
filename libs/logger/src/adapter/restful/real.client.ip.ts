import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RealClientIP {
  parse(context: ExecutionContext): Error {
    const req = context.switchToHttp().getRequest<Request>();

    let ip;

    ip = this.parseFromAliCloud();

    if (ip) {
      this.setIP(context, ip);
      return;
    }

    try {
      ip = this.parseFromTunnel(req.ip);

      if (ip) {
        this.setIP(context, ip);
      }
    } catch (ex) {
      return ex;
    }

    return;
  }

  setIP(context: ExecutionContext, ip: string) {
    const req = context.switchToHttp().getRequest<Request>();

    // @see https://expressjs.com/en/guide/overriding-express-api.html
    Object.defineProperty(req, 'ip', {
      configurable: true,
      enumerable: true,
      get() {
        return ip;
      },
    });
  }

  parseFromAliCloud(): string {
    return;
  }

  parseFromTunnel(ip: string): string {
    return;
  }
}
