import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './adapter/model/user.model';
import { USER_REPOSITORY } from './user.constant';
import { MySqlUserRepository } from './adapter/mysql.user.repository';
import { EVENT_BUS } from '../dddcore/dddcore.constant';
import { EventEmitter2EventBus } from '../dddcore/adapter/event.emitter2.event.bus';
import { CreateUserUseCase } from './usecase/create.user.usecase';
import { RenameUseCase } from './usecase/rename.usecase';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserModel], 'default')],
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
    CreateUserUseCase,
    RenameUseCase,
  ],
})
export class UserModule {}
