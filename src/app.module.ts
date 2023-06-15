import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { UserModule } from './user/user.module';
import { CreateDatabaseImports } from './infra/database.provider';
import { CreateRedisImports } from './infra/redis.provider';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ...CreateDatabaseImports(),
    ...CreateRedisImports(),
    UserModule,
    LoggerModule,
  ],
})
export class AppModule {}
