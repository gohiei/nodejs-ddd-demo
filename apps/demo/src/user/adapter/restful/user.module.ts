import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { EventEmitter2EventBus } from '@lib/dddcore/adapter/event.emitter2.event.bus';

import { UserController } from './user.controller';
import { UserModel } from '../model/user.model';
import { ID_REPOSITORY, USER_REPOSITORY } from '../../user.constant';
import { MySqlUserRepository } from '../mysql.user.repository';
import { CreateUserUseCase } from '../../usecase/create.user.usecase';
import { RenameUseCase } from '../../usecase/rename.usecase';
import { NotifyManagerHandler } from '../../usecase/handler/notify.manager.handler';
import { UserPasswordModel } from '../model/user.password.model';
import { PastUserPasswordModel } from '../model/past.user.password.model';
import { ChangePasswordUseCase } from '../../usecase/change.password.usecase';
import { CheckIfARiskfulUserUseCase } from '../../usecase/handler/check-if-a-riskful-user.handler';
import { ClearUserCache } from '../../usecase/handler/clear-user-cache.handler';
import { RedisIDRepository } from '../redis.id.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature(
      [UserModel, UserPasswordModel, PastUserPasswordModel],
      'default',
    ),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MySqlUserRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: EventEmitter2EventBus,
    },
    {
      provide: ID_REPOSITORY,
      useClass: RedisIDRepository,
    },
    CreateUserUseCase,
    RenameUseCase,
    ChangePasswordUseCase,
    NotifyManagerHandler,
    CheckIfARiskfulUserUseCase,
    ClearUserCache,
  ],
})
export class UserModule {}
