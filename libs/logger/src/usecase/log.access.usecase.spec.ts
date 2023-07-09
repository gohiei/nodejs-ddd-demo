import { LoggerService } from '@nestjs/common';
import { EventBus } from '@lib/dddcore/event.bus';
import { DateTime } from '@lib/dddcore/utility/datetime';
import { LogAccessUseCase, LogAccessUseCaseInput } from './log.access.usecase';
import { RequestDoneEvent } from '../entity/request-done.event';

describe('LogAccess UseCase', () => {
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

  describe('execute', () => {
    it('should be ok', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const input: LogAccessUseCaseInput = {
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        http_version: '1.1',
        user_agent: 'Tester/1.0',
        xff: '1.1.1.1,2.2.2.2',
        status_code: 200,
        content_length: 101,
        latency: 30,
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        full_path: 'PUT /api/user/:id',
      };

      const uc = new LogAccessUseCase(logger, eb);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
      expect(logFn).toBeCalledWith(
        '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123 HTTP/1.1" "Tester/1.0" "1.1.1.1,2.2.2.2" 200 101 30 13 this.is.a.fake.host e6d274d0-313f-4b48-9fcd-23a6e3ce36bc "PUT /api/user/:id"',
      );
    });
  });

  describe('when', () => {
    it('should be ok', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const event = new RequestDoneEvent({
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        http_version: '1.1',
        user_agent: 'Tester/1.0',
        xff: '1.1.1.1,2.2.2.2',
        status_code: 200,
        content_length: 101,
        latency: 30,
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        full_path: 'PUT /api/user/:id',
        request_body: { username: 'xxx' },
        response_data: null,
        refer: '-',
      });

      const uc = new LogAccessUseCase(logger, eb);
      await uc.when(uc.eventName, event);

      expect(logFn).toBeCalledTimes(1);
      expect(logFn).toBeCalledWith(
        '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123 HTTP/1.1" "Tester/1.0" "1.1.1.1,2.2.2.2" 200 101 30 13 this.is.a.fake.host e6d274d0-313f-4b48-9fcd-23a6e3ce36bc "PUT /api/user/:id"',
      );
    });
  });
});
