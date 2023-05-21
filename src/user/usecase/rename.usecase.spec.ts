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
      const input: RenameUseCaseInput = {
        id: UUID.new().toString(),
        username: 'test2',
      };

      const user = User.build(input.id, 'test1', 'password1');
      fn.mockReturnValueOnce(user);

      const uc = new RenameUseCase(repo, eb);
      const output = uc.execute(input);

      expect(output.result).toBe('ok');
      expect(output.ret).not.toBeNull();
      expect(output.ret.id).toBe(input.id);
      expect(output.ret.username).toBe('test2');
    });
  });
});
