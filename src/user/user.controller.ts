import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import 'dotenv/config';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from './usecase/create.user.usecase';
import { DataSource } from 'typeorm';
import { EventEmitter2EventBus } from '../dddcore/adapter/event.emitter2.event.bus';
import { UserModel } from './adapter/model/user.model';
import { MySqlUserRepository } from './adapter/mysql.user.repository';
import { RenameUseCase, RenameUseCaseInput } from './usecase/rename.usecase';

export class CreateUserDto {
  readonly username: string = '';
  readonly password: string = '';
}

export class RenameUserDto {
  readonly username: string = '';
}

@Controller('user')
export class UserController {
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const ds = new DataSource({
      type: 'mysql',
      synchronize: false,
      logging: true,
      entities: [UserModel],
      cache: true,
      replication: {
        master: { url: process.env.USER_WRITE_DB_DSN },
        slaves: [{ url: process.env.USER_READ_DB_DSN }],
      },
    });

    await ds.initialize();

    const repo = new MySqlUserRepository(ds);
    const eb = new EventEmitter2EventBus();

    const uc = new CreateUserUseCase(repo, eb);

    const input: CreateUserUseCaseInput = {
      ...body,
    };

    const output = await uc.execute(input);

    return {
      result: 'ok',
      ret: output,
    };
  }

  @Put('/:id')
  async rename(@Param('id') id: string, @Body() body: RenameUserDto) {
    const ds = new DataSource({
      type: 'mysql',
      synchronize: false,
      logging: true,
      entities: [UserModel],
      cache: true,
      replication: {
        master: { url: process.env.USER_WRITE_DB_DSN },
        slaves: [{ url: process.env.USER_READ_DB_DSN }],
      },
    });

    await ds.initialize();

    const repo = new MySqlUserRepository(ds);
    const eb = new EventEmitter2EventBus();

    const uc = new RenameUseCase(repo, eb);

    const input: RenameUseCaseInput = {
      id,
      username: body.username,
    };

    const output = await uc.execute(input);

    return {
      result: 'ok',
      ret: output,
    };
  }
}
