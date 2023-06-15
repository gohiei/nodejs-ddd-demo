import { RedisIDRepository } from './redis.id.repository';

describe('RedisIDRepository', () => {
  let redis;

  beforeEach(async () => {
    redis = {
      incrby: jest.fn(),
    };
  });

  describe('incr', () => {
    it('should return id', async () => {
      jest.spyOn(redis, 'incrby').mockResolvedValue(123);

      const repo = new RedisIDRepository(redis);
      const gotID = await repo.incr(1);

      expect(gotID).toBe(123);
    });
  });
});
