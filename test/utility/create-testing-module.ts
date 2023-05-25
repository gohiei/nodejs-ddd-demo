import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';

let app: INestApplication;

export async function createTestingModule() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule],
  }).compile();

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
}
