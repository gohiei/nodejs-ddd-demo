import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import * as util from 'util';
import { ERROR_LOGGER } from '../logger.constant';
import { DateTime } from '@lib/dddcore/utility/datetime';

@Injectable()
export class ErrorLogger {
  constructor(@Inject(ERROR_LOGGER) private readonly logger: LoggerService) {}

  write(message: any): void {
    this.logger.log(message);
  }

  log(ctx: HttpArgumentsHost, error: Error): void {
    const req = ctx.getRequest<Request>();

    const { ip, method, originalUrl } = req;
    const requestId = req.get('x-request-id') || '-';
    const host = req.get('host') || '-';
    const domain = req.get('domain') || '-';

    this.write(
      util.format(
        '%s %s "%s %s" %s %s %s %s %s',
        new DateTime().format(),
        ip,
        method,
        originalUrl,
        domain,
        requestId,
        host,
        error.message,
        JSON.stringify(error.stack),
      ),
    );
  }
}
