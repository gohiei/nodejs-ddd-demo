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

async function main() {
  console.log(process.env.USER_WRITE_DB_DSN);

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
  const eb = new FakeEventBus();
  const uc = new RenameUseCase(repo, eb);

  const input: RenameUseCaseInput = {
    id: '4fcd1879-af20-4c62-a845-bf4c17ca98b9',
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
