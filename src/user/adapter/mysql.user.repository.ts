import { DataSource, Repository } from 'typeorm';

import { User } from '../entity/user';
import { ErrUserNotFound, UserRepository } from '../repository/user.repository';
import { UserModel } from './model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class MySqlUserRepository implements UserRepository {
  private readonly userRepo: Repository<UserModel>;

  constructor(
    // @todo Datasource 可省略
    @InjectDataSource('default')
    private dataSource: DataSource,
  ) {
    this.userRepo = dataSource.getRepository(UserModel);
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
