import { DataSource, Repository } from 'typeorm';

import { User } from '../entity/user';
import { ErrUserNotFound, UserRepository } from '../repository/user.repository';
import { UserModel } from './model/user.model';

export class MySqlUserRepository implements UserRepository {
  private datasource: DataSource;
  private userRepo: Repository<UserModel>;

  constructor(ds: DataSource) {
    this.datasource = ds;
    this.userRepo = this.datasource.getRepository(UserModel);
  }

  async getByID(id: string): Promise<User> {
    const u = await this.userRepo.findOneBy({ id });

    if (!u) {
      throw ErrUserNotFound;
    }

    return User.build(u.id, u.username, u.password);
  }

  async add(user: User): Promise<void> {
    const u = this.userRepo.create({
      id: user.getID(),
      username: user.getUsername(),
      password: user.getPassword(),
    });

    await this.userRepo.save(u);
  }

  async rename(user: User): Promise<void> {
    await this.userRepo.update(user.getID(), {
      username: user.getUsername(),
      updated_at: new Date(),
    });
  }
}
