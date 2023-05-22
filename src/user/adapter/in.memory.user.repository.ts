import { User } from '../entity/user';
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
}
