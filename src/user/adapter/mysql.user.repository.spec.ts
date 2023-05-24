import { DataSource, Repository, UpdateResult } from 'typeorm';
import { MySqlUserRepository } from './mysql.user.repository';
import { UUID } from '../../dddcore/uuid';
import { User } from '../entity/user';
import { UserModel } from './model/user.model';

describe('MySqlUserRepository', () => {
  let datasource: DataSource;
  let dsRepo: Repository<UserModel>;

  beforeEach(async () => {
    datasource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [UserModel],
      dropSchema: true,
      synchronize: true,
      logging: false,
    });
    await datasource.initialize();
    dsRepo = datasource.getRepository(UserModel);
  });

  describe('getByID', () => {
    it('should return User entity', async () => {
      const u = new UserModel();
      u.id = UUID.new().toString();
      u.username = 'test1';
      u.password = 'password1';

      const fn = jest.spyOn(dsRepo, 'findOneBy').mockResolvedValue(u);

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
      const fn = jest.spyOn(dsRepo, 'save').mockResolvedValue(new UserModel());
      const repo = new MySqlUserRepository(datasource);

      const user = User.build(UUID.new().toString(), 'test5', 'password3');
      await repo.add(user);

      expect(fn).toBeCalledTimes(1);
    });
  });

  describe('rename', () => {
    it('should return undefined', async () => {
      const result = new UpdateResult();
      result.raw = [];
      result.affected = 1;

      const fn = jest.spyOn(dsRepo, 'update').mockResolvedValue(result);
      const repo = new MySqlUserRepository(datasource);

      const user = User.build(UUID.new().toString(), 'test5', 'password3');
      await repo.rename(user);

      expect(fn).toBeCalledTimes(1);
    });
  });
});
