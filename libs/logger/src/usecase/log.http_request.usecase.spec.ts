import { LoggerService } from '@nestjs/common';
import { EventBus } from '@lib/dddcore/event.bus';
import { DateTime } from '@lib/dddcore/utility/datetime';
import { HTTPRequestDoneEvent } from '../entity/http-request-done.event';
import {
  LogHTTPRequestUseCase,
  LogHTTPRequestUseCaseInput,
} from './log.http_request.usecase';

describe('LogHTTPRequest UseCase', () => {
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
    it('should execute the use case with correct input', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const event = new HTTPRequestDoneEvent({
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        host: 'this.is.a.fake.host',
        req_header: 'X-REQUEST-ID: xxx-yyy-zzz-hhh',
        req_body: '-',
        status_code: 200,
        latency: 30,
        res_header: 'X-DOMAIN: 23',
        res_body: 'aaaa',
        error: undefined,
      });

      const uc = new LogHTTPRequestUseCase(logger, eb);
      await uc.when(event.getName(), event);

      expect(logFn).toBeCalledTimes(1);
      expect(logFn).toBeCalledWith(
        '2023-07-07T01:02:03 "PUT /api/user/123" this.is.a.fake.host "X-REQUEST-ID: xxx-yyy-zzz-hhh" "-" 200 30 "X-DOMAIN: 23" "aaaa"',
      );
    });
  });

  describe('execute', () => {
    it('should log the HTTP request information', async () => {
      const logFn = jest.spyOn(logger, 'log').mockResolvedValue('ok');

      const input: LogHTTPRequestUseCaseInput = {
        at: new DateTime('2023-07-07 01:02:03').toDate(),
        method: 'PUT',
        origin: '/api/user/123',
        host: 'this.is.a.fake.host',
        req_header: 'X-REQUEST-ID: xxx-yyy-zzz-hhh',
        req_body: undefined,
        status_code: 200,
        latency: 30,
        res_header: 'X-DOMAIN: 23',
        res_body: 'aaaa',
        error: undefined,
      };

      const uc = new LogHTTPRequestUseCase(logger, eb);
      const output = await uc.execute(input);
      expect(output).toBeTruthy();

      expect(logFn).toBeCalledTimes(1);
      expect(logFn).toBeCalledWith(
        '2023-07-07T01:02:03 "PUT /api/user/123" this.is.a.fake.host "X-REQUEST-ID: xxx-yyy-zzz-hhh" "-" 200 30 "X-DOMAIN: 23" "aaaa"',
      );
    });
  });
});
