import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import type { Redis } from 'ioredis';
import { redisMock } from 'ioredis-mock';
import { ID_REDIS_NAMESPACE } from '../../src/user/user.constant';

let app: INestApplication;

export async function createTestingModule() {
  const builder = Test.createTestingModule({
    imports: [AppModule, ConfigModule],
  })
    .overrideProvider(getRedisToken(ID_REDIS_NAMESPACE))
    .useClass(redisMock);

  const moduleFixture: TestingModule = await builder.compile();

  app = moduleFixture.createNestApplication();
  await app.init();
}

export async function closeTestingModule() {
  if (!app) {
    return;
  }

  await cleanUpDatabase();
}

export function getTestingModule(): INestApplication {
  if (!app) {
    throw new Error('No app created.');
  }

  return app;
}

export async function clearRepository(entities, dataSource = 'default') {
  for (const entity of entities) {
    const token = getRepositoryToken(entity, dataSource);
    const repo = app.get(token);
    await repo.clear();
  }
}

export async function cleanUpDatabase() {
  if (!app) {
    return;
  }

  const config = app.get(ConfigService);
  const mysqlConfig = config.get('mysql');
  const dbNames = Object.keys(mysqlConfig.connections);

  for (const name of dbNames) {
    const token = getDataSourceToken(name);
    const dataSource = app.get(token);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }

  const redisConfig = config.get('redis');

  Object.keys(redisConfig).forEach((name) => {
    const { namespace } = redisConfig[name];
    const token = getRedisToken(namespace);
    const redis: Redis = app.get(token);

    redis.disconnect();
  });
}
