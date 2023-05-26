import { PastUserPassword } from '../entity/past.user.password';
import { User } from '../entity/user';
import { UserPassword } from '../entity/user.password';
import {
  ErrFailedToAddUser,
  ErrFailedToRenameUser,
  ErrUserNotFound,
  UserRepository,
} from '../repository/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async getByID(id: string): Promise<User> {
    const user = this.users.get(id);

    if (!user) {
      throw ErrUserNotFound;
    }

    return Promise.resolve(user);
  }

  async add(user: User): Promise<void> {
    const id = user.getID();

    if (this.users.has(id)) {
      throw ErrFailedToAddUser;
    }

    this.users.set(id, user);
  }

  async rename(user: User): Promise<void> {
    const id = user.getID();

    if (!this.users.has(id)) {
      throw ErrFailedToRenameUser;
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
}
