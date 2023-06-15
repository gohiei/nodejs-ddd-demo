import { Exception } from '@/dddcore/error';
import { PastUserPassword } from '../entity/past.user.password';
import { User } from '../entity/user';
import { UserPassword } from '../entity/user.password';
import { UserRepository } from '../repository/user.repository';
import { IdRepository } from '../repository/id.repository';

export class InMemoryUserRepository implements UserRepository, IdRepository {
  private users: Map<string, User> = new Map();
  private userID = 0;

  async getByID(id: string): Promise<User> {
    const user = this.users.get(id);

    if (!user) {
      throw Exception.New('10003', 'user not found');
    }

    return Promise.resolve(user);
  }

  async add(user: User): Promise<void> {
    const id = user.getID();

    if (this.users.has(id)) {
      throw Exception.New('10004', 'duplicate user id');
    }

    this.users.set(id, user);
  }

  async rename(user: User): Promise<void> {
    const id = user.getID();

    if (!this.users.has(id)) {
      throw Exception.New('10005', 'user not found');
    }

    this.users[id] = user;
  }

  async getPasswordByUser(user: User): Promise<UserPassword> {
    return this.users.get(user.getID()).getUserPassword();
  }

  async getPastPasswordByUser(user: User): Promise<void | PastUserPassword> {
    return this.users.get(user.getID()).getPastUserPassword();
  }

  async changePassword(user: User): Promise<void> {
    this.users.set(user.getID(), user);
  }

  async incr(step = 1): Promise<number> {
    this.userID = this.userID + step;
    return this.userID;
  }
}
