import { Repository } from '@/dddcore/repository';

export interface IdRepository extends Repository {
  incr(step: number): Promise<number>;
}
