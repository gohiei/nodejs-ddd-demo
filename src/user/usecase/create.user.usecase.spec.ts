import { EventBus } from '../../dddcore/event.bus';
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
    };

    eb = {
      post: jest.fn(),
      postAll: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
    };
  });

  describe('execute', () => {
    it('should return ok', () => {
      const input: CreateUserUseCaseInput = {
        username: 'test1',
        password: 'password1',
      };

      const uc = new CreateUserUseCase(repo, eb);
      const output = uc.execute(input);

      expect(output.result).toBe('ok');
      expect(output.ret).not.toBeNull();
      expect(output.ret.id.length).toBeGreaterThan(1);
      expect(output.ret.username).toBe('test1');
    });
  });
});
