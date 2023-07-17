import { Repository } from '@lib/dddcore/index';

export interface IdRepository extends Repository {
  incr(step: number): Promise<number>;
}
