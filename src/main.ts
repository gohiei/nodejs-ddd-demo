// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { MySqlUserRepository } from './user/adapter/mysql.user.repository';
import { FakeEventBus } from './dddcore/adapter/fake.event.bus';
import { UserModel } from './user/adapter/model/user.model';
import {
  RenameUseCase,
  RenameUseCaseInput,
} from './user/usecase/rename.usecase';
import { EventEmitter2EventBus } from './dddcore/adapter/event.emitter2.event.bus';
import { NotifyManagerHandler } from './user/usecase/notify.manager.handler';

async function main() {
  const ds = new DataSource({
    type: 'mysql',
    synchronize: false,
    logging: false,
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
  const nm = new NotifyManagerHandler(eb);

  const input: RenameUseCaseInput = {
    id: 'f7e41e07-c9cf-47bd-972f-64fec0882f20',
    username: 'chuck6',
  };

  try {
    const output = await uc.execute(input);
    console.log(output.result, output);
  } catch (err) {
    console.error(err);
  }

  await ds.destroy();
}

main();
