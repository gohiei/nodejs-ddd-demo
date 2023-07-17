import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import { Exception, EVENT_BUS } from '@lib/dddcore/index';
import { HttpExceptionFilter } from './http-exception.filter';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('HttpExceptionFilter', () => {
  let service: HttpExceptionFilter;
  const postFn = jest.fn();
  const replyFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: EVENT_BUS,
          useValue: {
            post: postFn,
          },
        },
        {
          provide: HttpAdapterHost,
          useValue: {
            httpAdapter: {
              reply: replyFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('catch', () => {
    let mockArgumentsHost;
    let mockHttpArgumentsHost;

    beforeEach(() => {
      mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
        getResponse: jest.fn(),
        getRequest: () => {
          return {
            get: jest.fn(),
          };
        },
      }));

      mockArgumentsHost = {
        switchToHttp: mockHttpArgumentsHost,
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('when an unexpected error', () => {
      it('should be ok', async () => {
        service.catch(new Error('unexpected error'), mockArgumentsHost);

        jest.runAllTimers();

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(replyFn).toBeCalledTimes(1);
        expect(postFn).toBeCalledTimes(1);
      });
    });

    describe('when an expected error', () => {
      it('should be ok', async () => {
        service.catch(
          Exception.NewI('98XXXE', 'Expected error'),
          mockArgumentsHost,
        );

        jest.runAllTimers();

        expect(mockHttpArgumentsHost).toBeCalledTimes(1);
        expect(replyFn).toBeCalledTimes(1);
        expect(postFn).toBeCalledTimes(0);
      });
    });
  });
});
