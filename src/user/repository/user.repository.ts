import { Repository } from '../../dddcore/repository';
import { User } from '../entity/user';

export interface UserRepository extends Repository {
  getByID(id: string): User;
  add(user: User): null | Error;
  rename(user: User): null | Error;
}
