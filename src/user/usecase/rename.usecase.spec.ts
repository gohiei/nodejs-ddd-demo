import { EventBus } from '../../dddcore/event.bus';
import { UUID } from '../../dddcore/uuid';
import { User } from '../entity/user';
import { UserRepository } from '../repository/user.repository';
import { RenameUseCase, RenameUseCaseInput } from './rename.usecase';

describe('Rename UseCase', () => {
  let repo: UserRepository;
  let eb: EventBus;
  const fn = jest.fn();

  beforeEach(() => {
    repo = {
      getByID: fn,
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
      const input: RenameUseCaseInput = {
        id: UUID.new().toString(),
        username: 'test2',
      };

      const user = User.build(input.id, 'test1', 'password1');
      fn.mockReturnValueOnce(user);

      const uc = new RenameUseCase(repo, eb);
      const output = await uc.execute(input);

      expect(output).not.toBeNull();
      expect(output.id).toBe(input.id);
      expect(output.username).toBe('test2');
    });
  });
});
