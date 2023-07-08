import { EventBus } from '@lib/dddcore/event.bus';
import { UserRepository } from '../repository/user.repository';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from './create.user.usecase';
import { IdRepository } from '../repository/id.repository';

describe('CreateUser UseCase', () => {
  let idRepo: IdRepository;
  let userRepo: UserRepository;
  let eb: EventBus;

  beforeEach(() => {
    idRepo = {
      incr: jest.fn(),
    };

    userRepo = {
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
      jest.spyOn(idRepo, 'incr').mockResolvedValueOnce(123);

      const input: CreateUserUseCaseInput = {
        username: 'test1',
        password: 'password1',
      };

      const uc = new CreateUserUseCase(idRepo, userRepo, eb);
      const output = await uc.execute(input);

      expect(output).not.toBeNull();
      expect(output.id.length).toBeGreaterThan(1);
      expect(output.username).toBe('test1');
      expect(output.user_id).toBe(123);
    });
  });
});
