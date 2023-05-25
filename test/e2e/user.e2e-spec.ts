import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModel } from '../../src/user/adapter/model/user.model';
import {
  clearRepository,
  getTestingModule,
} from '../utility/create-testing-module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = getTestingModule();

    await clearRepository([UserModel], 'default');
  });

  describe('POST /user', () => {
    it('should return ok', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'test1',
          password: 'password1',
        })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body.result).toBe('ok');
          expect(body.ret.id).toBeDefined();
          expect(body.ret.username).toBe('test1');
        });
    });
  });

  describe('PUT /user/:id', () => {
    it('should return ok', async () => {
      const out = await request(app.getHttpServer()).post('/user').send({
        username: 'test1',
        password: 'password1',
      });

      const id = out.body.ret.id;

      return request(app.getHttpServer())
        .put(`/user/${id}`)
        .send({
          username: 'test2',
        })
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
  });
});
