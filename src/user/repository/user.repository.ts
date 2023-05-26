import { Repository } from '../../dddcore/repository';
import { PastUserPassword } from '../entity/past.user.password';
import { User } from '../entity/user';
import { UserPassword } from '../entity/user.password';

export const ErrUserNotFound = new Error(
  'the user was not found in the repository',
);
export const ErrFailedToAddUser = new Error(
  'failed to add the user to the repository',
);
export const ErrFailedToRenameUser = new Error(
  'failed to rename the user in the repository',
);

export const ErrUserPasswordNotFound = new Error(
  'the `user password` was not found in the repository',
);

export interface UserRepository extends Repository {
  getByID(id: string): Promise<User>;
  add(user: User): Promise<void>;
  rename(user: User): Promise<void>;
  getPasswordByUser(user: User): Promise<UserPassword>;
  getPastPasswordByUser(user: User): Promise<PastUserPassword | void>;
  changePassword(user: User): Promise<void>;
}
