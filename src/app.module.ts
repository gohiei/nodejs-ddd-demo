import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { CreateDatabaseImports } from './infra/database.provider';
import { CreateRedisImports } from './infra/redis.provider';
import { UserModule } from './user/adapter/restful/user.module';
import { LoggerModule } from './logger/adapter/restful/logger.module';
import { AuthModule } from './auth/adapter/restful/auth.module';
import { DDDCoreModule } from './dddcore/adapter/restful/dddcore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ...CreateDatabaseImports(),
    ...CreateRedisImports(),
    DDDCoreModule,
    LoggerModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
