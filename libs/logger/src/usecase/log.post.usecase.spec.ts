import { LoggerService } from '@nestjs/common';
import { EventBus } from '@lib/dddcore/index';
import { DateTime } from '@lib/dddcore/utility/index';
import { LogPostUseCase, LogPostUseCaseInput } from './log.post.usecase';
import { RequestDoneEvent } from '../entity/events/request-done.event';

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

  describe('execute', () => {
    it('should be ok', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const input: LogPostUseCaseInput = {
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        status_code: 200,
        content_length: 101,
        domain: 13,
        host: 'this.is.a.fake.host',
        request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
        ip: '122.1.1.1',
        req_body: { username: 'xxx' },
        res_body: '{"result": "ok"}',
      };

      const uc = new LogPostUseCase(logger, eb);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
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
        req_body: { username: 'xxx' },
        res_body: '{"result": "ok"}',
        refer: '-',
      });

      const uc = new LogPostUseCase(logger, eb);
      await uc.when(uc.eventName, event);

      expect(logFn).toBeCalledTimes(1);
    });

    it('should be empty if given a GET method', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const event = new RequestDoneEvent({
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'GET',
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
        full_path: 'GET /api/user/:id',
        req_body: null,
        res_body: '{"result": "ok"}',
        refer: '-',
      });

      const uc = new LogPostUseCase(logger, eb);
      await uc.when(uc.eventName, event);

      expect(logFn).toBeCalledTimes(0);
    });
  });
});
