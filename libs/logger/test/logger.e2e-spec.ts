import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DDDCoreModule } from '@lib/dddcore/index';
import { LoggerModule } from '@lib/logger/index';
import { TestModule } from './test.module';

describe('Logger (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, DDDCoreModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /test', () => {
    it('should return ok', () => {
      return request(app.getHttpServer())
        .get('/test')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.result).toBe('ok');
          expect(body.ret).toBeTruthy();
        });
    });
  });
});
