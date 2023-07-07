import { EventBus } from '@lib/dddcore/event.bus';
import {
  CheckAuthorizationUseCase,
  CheckAuthorizationUseCaseInput,
} from './check.authorization.usecase';

describe('CheckAuthorizationUseCase', () => {
  let usecase: CheckAuthorizationUseCase;
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = {
      post: jest.fn(),
      postAll: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
    };
    usecase = new CheckAuthorizationUseCase(eventBus);
  });

  it('should return `true`', async () => {
    const token =
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA';

    const input: CheckAuthorizationUseCaseInput = {
      token,
      ip: '127.0.0.1',
      xff: '',
      method: 'GET',
      url: '/api/xxx',
    };

    const output = await usecase.execute(input);
    expect(output.valid).toBeTruthy();
  });

  it('should return `true` (ignore route)', async () => {
    const input: CheckAuthorizationUseCaseInput = {
      token: '',
      ip: '127.0.0.1',
      xff: '',
      method: 'POST',
      url: '/api/user',
    };

    const output = await usecase.execute(input);
    expect(output.valid).toBeTruthy();
  });

  it('should return `false`', async () => {
    const input: CheckAuthorizationUseCaseInput = {
      token: '',
      ip: '127.0.0.1',
      xff: '',
      method: 'POST',
      url: '/api/xxx',
    };

    const postFn = jest.spyOn(eventBus, 'postAll');

    try {
      await usecase.execute(input);
    } catch (err) {
      expect(err.message).toBe('Invalid Authorization');
      expect(postFn).toBeCalledTimes(1);
    }
  });
});
