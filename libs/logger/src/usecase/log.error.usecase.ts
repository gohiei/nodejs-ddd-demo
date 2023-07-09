import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UseCase } from '@lib/dddcore/usecase';
import { ERROR_LOGGER } from '../logger.constant';
import { ErrorLog } from '../entity/error.log';

export type LogErrorUseCaseInput = {
  at: Date;
  ip: string;
  method: string;
  origin: string;
  domain: number;
  request_id: string;
  host: string;
  error: Error;
};

type LogErrorUseCaseOutput = boolean;

@Injectable()
export class LogErrorUseCase implements UseCase {
  constructor(@Inject(ERROR_LOGGER) private readonly logger: LoggerService) {}

  execute(input: LogErrorUseCaseInput): LogErrorUseCaseOutput {
    const errorLog = new ErrorLog({
      at: input.at,
      ip: input.ip,
      method: input.method,
      origin: input.origin,
      domain: input.domain,
      requestID: input.request_id,
      host: input.host,
      error: input.error,
    });

    this.logger.log(errorLog.toString());

    return true;
  }
}
