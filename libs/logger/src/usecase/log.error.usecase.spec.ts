import { LoggerService } from '@nestjs/common';
import { DateTime } from '@lib/dddcore/utility/index';
import { EventBus } from '@lib/dddcore/index';
import { LogErrorUseCase, LogErrorUseCaseInput } from './log.error.usecase';
import { UnexpectedErrorRaisedEvent } from '../entity/events/unexpected-error-raised.event';

describe('LogPost UseCase', () => {
  let logger: LoggerService;
  let eb: EventBus;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    eb = {
      post: jest.fn(),
      postAll: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
    };
  });

  describe('when', () => {
    it('should be ok', () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const event = new UnexpectedErrorRaisedEvent({
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        error: new Error('unexpected error'),
      });

      const uc = new LogErrorUseCase(logger, eb);
      const output = uc.when(event.getName(), event);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
    });
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

      const uc = new LogErrorUseCase(logger, eb);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
    });
  });
});
