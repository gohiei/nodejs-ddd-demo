import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, ClusterModule } from '@liaoliaots/nestjs-redis';

const env = process.env.NODE_ENV || 'development';
const isTest = env === 'test';

const createRootAsync = (namespace) => {
  return RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const redisConfig = config.get(`redis.${namespace}`);

      if (isTest) {
        redisConfig.url = 'redis://127.0.0.1:6379/10';
      }

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

      if (isTest) {
        redisConfig.url = 'redis://127.0.0.1:6379/10';
      }

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
