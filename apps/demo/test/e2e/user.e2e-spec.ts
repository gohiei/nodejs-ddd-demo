import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModel } from '@app/demo/user/adapter/model/user.model';
import {
  clearRepository,
  getTestingModule,
} from '../utility/create-testing-module';
import { DateTime } from '@lib/dddcore/utility/datetime';
import { Redis } from 'ioredis';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { ID_REDIS_NAMESPACE } from '@app/demo/user/user.constant';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = getTestingModule();

    await clearRepository([UserModel], 'default');
  });

  describe('POST /api/user', () => {
    it('should return ok', () => {
      const redis = app.get<Redis>(getRedisToken(ID_REDIS_NAMESPACE));
      jest.spyOn(redis, 'incrby').mockResolvedValue(199);

      return request(app.getHttpServer())
        .post('/api/user')
        .send({
          username: 'test1',
          password: 'password1',
        })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body.result).toBe('ok');
          expect(body.ret.id).toBeDefined();
          expect(body.ret.username).toBe('test1');
          expect(body.ret.user_id).toBe(199);
        });
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should return ok', async () => {
      const out = await request(app.getHttpServer()).post('/api/user').send({
        username: 'test1',
        password: 'password1',
      });

      const id = out.body.ret.id;

      return request(app.getHttpServer())
        .put(`/api/user/${id}`)
        .send({
          username: 'test2',
        })
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA',
        )
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toMatchObject({
            result: 'ok',
            ret: {
              id,
              username: 'test2',
            },
          });
        });
    });

    it('should return error', async () => {
      return request(app.getHttpServer())
        .put(`/api/user/xxxx-yyy-zzz-dddd`)
        .send({
          username: 'test2',
        })
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA',
        )
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body).toMatchObject({
            http_status_code: 400,
            result: 'error',
            message: 'user not found',
            code: '10001',
          });
        });
    });
  });

  describe('PUT /api/user/:id/password', () => {
    it('should return ok', async () => {
      const out = await request(app.getHttpServer()).post('/api/user').send({
        username: 'test1',
        password: 'password1',
      });

      const id = out.body.ret.id;

      return request(app.getHttpServer())
        .put(`/api/user/${id}/password`)
        .send({
          new_password: 'password2',
          confirm_password: 'password2',
          password_expire_at: new DateTime().add(10, 'day').format(),
        })
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA',
        )
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toMatchObject({
            result: 'ok',
          });
        });
    });
  });
});
