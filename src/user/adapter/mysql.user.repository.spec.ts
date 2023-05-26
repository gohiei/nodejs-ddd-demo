import { DataSource, Repository, UpdateResult } from 'typeorm';
import { MySqlUserRepository } from './mysql.user.repository';
import { UUID } from '../../dddcore/uuid';
import { User } from '../entity/user';
import { UserModel } from './model/user.model';
import { UserPasswordModel } from './model/user.password.model';
import { PastUserPasswordModel } from './model/past.user.password.model';

describe('MySqlUserRepository', () => {
  let datasource: DataSource;
  let userRepo: Repository<UserModel>;
  let userPasswordRepo: Repository<UserPasswordModel>;
  let pastPasswordRepo: Repository<PastUserPasswordModel>;

  beforeEach(async () => {
    datasource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [UserModel, UserPasswordModel, PastUserPasswordModel],
      dropSchema: true,
      synchronize: true,
      logging: false,
    });
    await datasource.initialize();
    userRepo = datasource.getRepository(UserModel);
    userPasswordRepo = datasource.getRepository(UserPasswordModel);
    pastPasswordRepo = datasource.getRepository(PastUserPasswordModel);
  });

  describe('getByID', () => {
    it('should return User entity', async () => {
      const u = new UserModel();
      u.id = UUID.new().toString();
      u.username = 'test1';
      u.password = 'password1';

      const fn = jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(u);

      const repo = new MySqlUserRepository(datasource);
      const user = await repo.getByID(u.id);

      expect(user.getID()).toBe(u.id);
      expect(user.getUsername()).toBe(u.username);
      expect(user.getPassword()).toBe(u.password);

      expect(fn).toBeCalledTimes(1);
    });
  });

  describe('add', () => {
    it('should return undefined', async () => {
      const fn1 = jest.spyOn(userRepo, 'insert');
      const fn2 = jest.spyOn(userPasswordRepo, 'insert');

      const repo = new MySqlUserRepository(datasource);

      const user = await User.create('test5', 'password3');

      await repo.add(user);

      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(1);
    });
  });

  describe('rename', () => {
    it('should return undefined', async () => {
      const result = new UpdateResult();
      result.raw = [];
      result.affected = 1;

      const fn = jest.spyOn(userRepo, 'update').mockResolvedValue(result);
      const repo = new MySqlUserRepository(datasource);

      const user = User.build(UUID.new().toString(), 'test5', 'password3');
      await repo.rename(user);

      expect(fn).toBeCalledTimes(1);
    });
  });

  describe('changePassword', () => {
    it('should return undefined', async () => {
      const fn1 = jest.spyOn(userRepo, 'update');
      const fn2 = jest.spyOn(userPasswordRepo, 'update');
      const fn3 = jest.spyOn(pastPasswordRepo, 'upsert');

      const repo = new MySqlUserRepository(datasource);

      const user = await User.create('test5', 'pw6');
      await user.changePassword('123456');
      await repo.changePassword(user);

      expect(fn1).toBeCalledTimes(1);
      expect(fn2).toBeCalledTimes(1);
      expect(fn3).toBeCalledTimes(1);
    });
  });
});
