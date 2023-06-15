import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { IdRepository } from '../repository/id.repository';
import { ID_REDIS_NAMESPACE } from '../user.constant';

@Injectable()
export class RedisIDRepository implements IdRepository {
  private redis: Redis;

  constructor(@InjectRedis(ID_REDIS_NAMESPACE) redis: Redis) {
    this.redis = redis;
  }

  async incr(step = 1): Promise<number> {
    return await this.redis.incrby('this.is.my.user.id', step);
  }
}
