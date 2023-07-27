import { Test, TestingModule } from '@nestjs/testing';
import { LoggerInterceptor } from './logger.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { RealClientIP } from './real.client.ip';

describe('LoggerInterceptor', () => {
  let service: LoggerInterceptor;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerInterceptor, RealClientIP],
    }).compile();

    service = module.get<LoggerInterceptor>(LoggerInterceptor);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('intercept', () => {
    let ctx: ExecutionContext;
    let next: CallHandler;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
      mockResponse = {
        set: jest.fn(),
      };

      mockRequest = {
        get: jest.fn(),
        headers: {},
      };

      next = { handle: jest.fn().mockResolvedValue(true) };
      ctx = {
        switchToHttp: jest.fn().mockImplementation(() => ({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        })),
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      };
    });

    afterEach(() => jest.resetAllMocks());

    describe('when `x-request-id` is undefined', () => {
      it('should be ok', () => {
        const getFn = jest.spyOn(mockRequest, 'get').mockReturnValueOnce(null);
        const setFn = jest.spyOn(mockResponse, 'set').mockReturnValueOnce(null);

        expect(mockRequest.headers['x-request-id']).toBeUndefined();

        service.intercept(ctx, next);

        expect(getFn).toBeCalledTimes(2);
        expect(setFn).toBeCalledTimes(1);
        expect(mockRequest.headers['x-request-id']).toBeDefined();
      });
    });

    describe('when `x-request-id` is defined', () => {
      it('should be ok', () => {
        const getFn = jest
          .spyOn(mockRequest, 'get')
          .mockReturnValueOnce('e6d274d0-313f-4b48-9fcd-23a6e3ce36bc');
        const setFn = jest.spyOn(mockResponse, 'set').mockReturnValueOnce(null);

        service.intercept(ctx, next);

        expect(getFn).toBeCalledTimes(2);
        expect(setFn).toBeCalledTimes(1);
      });
    });
  });
});
