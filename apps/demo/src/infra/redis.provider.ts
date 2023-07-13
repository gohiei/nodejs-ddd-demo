import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, ClusterModule } from '@liaoliaots/nestjs-redis';

const createRootAsync = (namespace) => {
  return RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const redisConfig = config.get(`redis.${namespace}`);

      return {
        closeClient: true,
        readyLog: true,
        errorLog: true,
        config: redisConfig,
      };
    },
  });
};

const createClusterRootAsync = (namespace) => {
  return ClusterModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const redisConfig = config.get(`redis.${namespace}`);

      return {
        closeClient: true,
        readyLog: true,
        errorLog: true,
        config: redisConfig,
      };
    },
  });
};

export const CreateRedisImports = () => [createRootAsync('id')];
