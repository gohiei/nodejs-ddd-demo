import { EventBus } from '@/dddcore/event.bus';
import { UserRepository } from './../repository/user.repository';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from './create.user.usecase';

describe('CreateUser UseCase', () => {
  let repo: UserRepository;
  let eb: EventBus;

  beforeEach(() => {
    repo = {
      getByID: jest.fn(),
      add: jest.fn(),
      rename: jest.fn(),
      getPasswordByUser: jest.fn(),
      getPastPasswordByUser: jest.fn(),
      changePassword: jest.fn(),
    };

    eb = {
      post: jest.fn(),
      postAll: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
    };
  });

  describe('execute', () => {
    it('should return ok', async () => {
      const input: CreateUserUseCaseInput = {
        username: 'test1',
        password: 'password1',
      };

      const uc = new CreateUserUseCase(repo, eb);
      const output = await uc.execute(input);

      expect(output).not.toBeNull();
      expect(output.id.length).toBeGreaterThan(1);
      expect(output.username).toBe('test1');
    });
  });
});
