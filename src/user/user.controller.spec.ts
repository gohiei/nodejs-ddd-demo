import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { RenameUseCase } from './usecase/rename.usecase';
import { CreateUserUseCase } from './usecase/create.user.usecase';
import { UUID } from '@/dddcore/utility/uuid';
import { ChangePasswordUseCase } from './usecase/change.password.usecase';
import { DateTime } from '@/dddcore/utility/datetime';
import { CheckIfARiskfulUserUseCase } from './usecase/handler/check-if-a-riskful-user.handler';

describe('UserController', () => {
  const renameFn = jest.fn().mockResolvedValue([]);
  const createUserFn = jest.fn().mockResolvedValue([]);
  const changePasswordFn = jest.fn().mockResolvedValue([]);
  const checkRiskfulFn = jest.fn().mockResolvedValue([]);

  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: createUserFn,
          },
        },
        {
          provide: RenameUseCase,
          useValue: {
            execute: renameFn,
          },
        },
        {
          provide: ChangePasswordUseCase,
          useValue: {
            execute: changePasswordFn,
          },
        },
        {
          provide: CheckIfARiskfulUserUseCase,
          useValue: {
            execute: checkRiskfulFn,
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should return ok', async () => {
      const username = 'test1';
      const password = 'password1';

      createUserFn.mockResolvedValue({
        id: UUID.new().toString(),
        username,
      });

      const output = await controller.createUser({
        username,
        password,
      });

      expect(output).not.toBeNull();
      expect(output.result).toBe('ok');
      expect(output.ret.id).toBeDefined();
      expect(output.ret.username).toBe(username);
    });
  });

  describe('rename', () => {
    it('should return ok', async () => {
      const id = '02418af3-33da-4a3a-a677-10f3f2920c3b';
      const username = 'test2';

      renameFn.mockResolvedValue({
        id,
        username,
      });

      const output = await controller.rename(id, { username });

      expect(output).not.toBeNull();
      expect(output.result).toBe('ok');
      expect(output.ret.id).toBe(id);
      expect(output.ret.username).toBe(username);
    });
  });

  describe('change password', () => {
    it('should return ok', async () => {
      const id = '02418af3-33da-4a3a-a677-10f3f2920c3b';
      const username = 'test2';

      changePasswordFn.mockResolvedValue({
        id,
        username,
      });

      const output = await controller.changePassword(id, {
        new_password: 'pw22',
        confirm_password: 'pw22',
        password_expire_at: new DateTime().add(10, 'day').toDate(),
      });

      expect(output).not.toBeNull();
      expect(output.result).toBe('ok');
    });
  });
});
