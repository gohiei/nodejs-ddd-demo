import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { UserModule } from './user/user.module';
import { CreateDatabaseImports } from './infra/database.provider';
import { CreateRedisImports } from './infra/redis.provider';
import { LoggerModule } from './logger/logger.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ID_REDIS_NAMESPACE } from './user/user.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ...CreateDatabaseImports(),
    ...CreateRedisImports(),
    // RedisModule.forRoot({
    //   config: {
    //     namespace: ID_REDIS_NAMESPACE,
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    UserModule,
    LoggerModule,
  ],
})
export class AppModule {}
