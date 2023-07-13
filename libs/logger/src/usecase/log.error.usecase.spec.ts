import { LoggerService } from '@nestjs/common';
import { DateTime } from '@lib/dddcore/utility/datetime';
import { LogErrorUseCase, LogErrorUseCaseInput } from './log.error.usecase';
import { Exception } from '../../../dddcore/src/error';

describe('LogPost UseCase', () => {
  let logger: LoggerService;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  describe('execute', () => {
    it('should be ok with an unexpected error', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const input: LogErrorUseCaseInput = {
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        error: new Error('unexpected error'),
      };

      const uc = new LogErrorUseCase(logger);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
    });

    it('should be ok with an expected error', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const input: LogErrorUseCaseInput = {
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        error: Exception.NewI('1111111', 'expected error'),
      };

      const uc = new LogErrorUseCase(logger);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
    });
  });
});
