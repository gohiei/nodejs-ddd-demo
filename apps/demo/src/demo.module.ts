import { Module } from '@nestjs/common';

import { CreateDatabaseImports } from './infra/database.provider';
import { CreateRedisImports } from './infra/redis.provider';
import { UserModule } from './user/adapter/restful/user.module';
import { LoggerModule } from '@lib/logger/adapter/restful/logger.module';
import { AuthModule } from './auth/adapter/restful/auth.module';
import { DDDCoreModule } from '@lib/dddcore/adapter/restful/dddcore.module';

@Module({
  imports: [
    ...CreateDatabaseImports(),
    ...CreateRedisImports(),
    DDDCoreModule,
    LoggerModule,
    AuthModule,
    UserModule,
  ],
})
export class DemoModule {}
