import { DataSource, Repository } from 'typeorm';

import { User } from '../entity/user';
import { UserRepository } from '../repository/user.repository';
import { UserModel } from './model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserPassword } from '../entity/user.password';
import { UserPasswordModel } from './model/user.password.model';
import { PastUserPasswordModel } from './model/past.user.password.model';
import { PastUserPassword } from '../entity/past.user.password';
import { Exception } from '@lib/dddcore/error';

@Injectable()
export class MySqlUserRepository implements UserRepository {
  private readonly userRepo: Repository<UserModel>;
  private readonly passwordRepo: Repository<UserPasswordModel>;
  private readonly pastRepo: Repository<PastUserPasswordModel>;

  constructor(
    @InjectDataSource('default')
    private readonly dataSource: DataSource,
  ) {
    this.dataSource = dataSource;
    this.userRepo = dataSource.getRepository(UserModel);
    this.passwordRepo = dataSource.getRepository(UserPasswordModel);
    this.pastRepo = dataSource.getRepository(PastUserPasswordModel);
  }

  async getByID(id: string): Promise<User> {
    const u = await this.userRepo.findOneBy({ id });

    if (!u) {
      throw Exception.New('10001', 'user not found');
    }

    return User.build({
      id: u.id,
      username: u.username,
      password: u.password,
      userID: u.userIntID,
    });
  }

  async add(user: User): Promise<void> {
    const u = this.userRepo.create({
      id: user.getID(),
      username: user.getUsername(),
      password: user.getPassword(),
      userIntID: user.getUserID(),
    });

    const pw = user.getUserPassword();

    const p = this.passwordRepo.create({
      user_id: user.getID(),
      hash: pw.getHash(),
      encrypted_password: Buffer.from(pw.getEncryptedPassword(), 'base64'),
      modified_at: pw.getModifiedAt(),
      expired_at: pw.getExpiredAt(),
      reset: pw.isReset(),
    });

    const ds = this.dataSource;
    await ds.transaction(async () => {
      await this.userRepo.insert(u);
      await this.passwordRepo.insert(p);
    });
  }

  async rename(user: User): Promise<void> {
    await this.userRepo.update(user.getID(), {
      username: user.getUsername(),
      updated_at: new Date(),
    });
  }

  async getPasswordByUser(user: User): Promise<UserPassword> {
    const up = await this.passwordRepo.findOneBy({ user_id: user.getID() });

    if (!up) {
      throw Exception.New('10002', 'user password not found');
    }

    user.buildUserPassword({
      hash: up.hash,
      encryptedPassword: up.encrypted_password.toString('base64'),
      modifiedAt: up.modified_at,
      expiredAt: up.expired_at,
      reset: up.reset,
    });

    return user.getUserPassword();
  }

  async getPastPasswordByUser(user: User): Promise<PastUserPassword | void> {
    const pup = await this.pastRepo.findOneBy({ user_id: user.getID() });

    if (!pup) {
      return;
    }

    user.buildPastUserPassword({
      hash2: pup.hash2,
      hash3: pup.hash3,
    });

    return user.getPastUserPassword();
  }

  async changePassword(user: User): Promise<void> {
    await this.dataSource.transaction(async () => {
      await this.userRepo.update(user.getID(), {
        password: user.getPassword(),
      });

      const p = user.getUserPassword();

      await this.passwordRepo.update(user.getID(), {
        hash: p.getHash(),
        encrypted_password: Buffer.from(p.getEncryptedPassword(), 'base64'),
        expired_at: p.getExpiredAt(),
        modified_at: p.getModifiedAt(),
        reset: p.isReset(),
      });

      const pup = user.getPastUserPassword();

      if (pup) {
        await this.pastRepo.upsert(
          {
            user_id: user.getID(),
            hash2: pup.getHash2(),
            hash3: pup.getHash3(),
          },
          ['user_id'],
        );
      }
    });
  }
}
