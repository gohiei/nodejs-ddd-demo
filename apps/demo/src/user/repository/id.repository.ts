import { Repository } from '@lib/dddcore/repository';

export interface IdRepository extends Repository {
  incr(step: number): Promise<number>;
}
