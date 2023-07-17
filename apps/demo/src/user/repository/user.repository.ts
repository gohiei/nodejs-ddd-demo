import { Repository } from '@lib/dddcore/index';
import { PastUserPassword } from '../entity/past.user.password';
import { User } from '../entity/user';
import { UserPassword } from '../entity/user.password';

export interface UserRepository extends Repository {
  getByID(id: string): Promise<User>;
  add(user: User): Promise<void>;
  rename(user: User): Promise<void>;
  getPasswordByUser(user: User): Promise<UserPassword>;
  getPastPasswordByUser(user: User): Promise<PastUserPassword | void>;
  changePassword(user: User): Promise<void>;
}
