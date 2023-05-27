import { EventBus } from '@/dddcore/event.bus';
import { DateTime } from '@/dddcore/utility/datetime';
import { User } from '../entity/user';
import { UserRepository } from './../repository/user.repository';
import {
  ChangePasswordUseCase,
  ChangePasswordUseCaseInput,
  ChangePasswordUseCaseOutput,
} from './change.password.usecase';

describe('ChangePassword UseCase', () => {
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
      const user = await User.create('test1', 'pw1');
      user.buildPastUserPassword({ hash2: '', hash3: '' });

      jest.spyOn(repo, 'getByID').mockResolvedValueOnce(user);
      jest
        .spyOn(repo, 'getPasswordByUser')
        .mockResolvedValueOnce(user.getUserPassword());

      const input: ChangePasswordUseCaseInput = {
        id: user.getID(),
        newPassword: '1234567',
        confirmPassword: '1234567',
        passwordExpireAt: new DateTime().add(10, 'day').toDate(),
      };

      const uc = new ChangePasswordUseCase(repo, eb);
      const output: ChangePasswordUseCaseOutput = await uc.execute(input);

      expect(output).toBeUndefined();
    });
  });

  describe('new password != confirm password', () => {
    it('should return error', async () => {
      const user = await User.create('test1', 'pw1');

      const input: ChangePasswordUseCaseInput = {
        id: user.getID(),
        newPassword: '1234567',
        confirmPassword: 'abcdefg',
      };

      const uc = new ChangePasswordUseCase(repo, eb);

      return uc.execute(input).catch((err: Error) => {
        expect(err.message).toBe(
          'New password and confirm password are differenet',
        );
      });
    });
  });
});
