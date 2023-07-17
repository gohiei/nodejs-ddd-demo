import { DateTime } from '@lib/dddcore/utility/datetime';
import { PostLog } from './post.log';

describe('PostLog Entity', () => {
  describe('Given all parameters', () => {
    describe('when fullly', () => {
      it('should be ok', () => {
        const params = {
          at: new DateTime('2023-07-07 01:02:03').toDate(),
          method: 'PUT',
          origin: '/api/user/123',
          statusCode: 200,
          contentLength: 101,
          domain: 13,
          host: 'this.is.a.fake.host',
          requestID: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
          ip: '122.1.1.1',
          reqBody: { username: 'xxx' },
          resBody: '{"result": "ok"}',
        };

        const log = new PostLog(params);
        expect(log.toString()).toEqual(
          '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123" 200 101 13 e6d274d0-313f-4b48-9fcd-23a6e3ce36bc this.is.a.fake.host {"username":"xxx"} {"result":"ok"}',
        );

        expect(log.toJSON()).toEqual({
          domain: 13,
          extra: {},
          host: 'this.is.a.fake.host',
          ip: '122.1.1.1',
          length: 101,
          method: 'PUT',
          origin: '/api/user/123',
          req_body: {
            username: 'xxx',
          },
          request_id: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
          res_body: {
            result: 'ok',
          },
          status_code: 200,
          time: '2023-07-07T01:02:03',
        });
      });
    });

    describe('when password exists', () => {
      it('should be masked', () => {
        const params = {
          at: new DateTime('2023-07-07 01:02:03').toDate(),
          method: 'PUT',
          origin: '/api/user/123',
          statusCode: 200,
          contentLength: 101,
          domain: 13,
          host: 'this.is.a.fake.host',
          requestID: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
          ip: '122.1.1.1',
          reqBody: { username: 'xxx', password: '12345qwer' },
          resBody: '{"result": "ok"}',
        };

        const log = new PostLog(params);
        expect(log.toString()).toEqual(
          '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123" 200 101 13 e6d274d0-313f-4b48-9fcd-23a6e3ce36bc this.is.a.fake.host {"username":"xxx","password":"******"} {"result":"ok"}',
        );
      });
    });

    describe('when responseData is not a string', () => {
      it('should be ok', () => {
        const params = {
          at: new DateTime('2023-07-07 01:02:03').toDate(),
          method: 'PUT',
          origin: '/api/user/123',
          statusCode: 200,
          contentLength: 101,
          domain: 13,
          host: 'this.is.a.fake.host',
          requestID: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
          ip: '122.1.1.1',
          reqBody: { username: 'xxx', password: '12345qwer' },
          resBody: { result: 'ok' },
        };

        const log = new PostLog(params);
        expect(log.toString()).toEqual(
          '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123" 200 101 13 e6d274d0-313f-4b48-9fcd-23a6e3ce36bc this.is.a.fake.host {"username":"xxx","password":"******"} {"result":"ok"}',
        );
      });
    });

    describe('when error occured', () => {
      it('should be ok', () => {
        const params = {
          at: new DateTime('2023-07-07 01:02:03').toDate(),
          method: 'PUT',
          origin: '/api/user/123',
          statusCode: 200,
          contentLength: 101,
          domain: 13,
          host: 'this.is.a.fake.host',
          requestID: 'e6d274d0-313f-4b48-9fcd-23a6e3ce36bc',
          ip: '122.1.1.1',
          reqBody: { username: 'xxx', password: '12345qwer' },
          resBody: '{{"re: "ok"}',
        };

        const log = new PostLog(params);
        expect(log.toString()).toEqual(
          '2023-07-07T01:02:03 122.1.1.1 "PUT /api/user/123" 200 101 13 e6d274d0-313f-4b48-9fcd-23a6e3ce36bc this.is.a.fake.host {"username":"xxx","password":"******"} "{{\\"re: \\"ok\\"}"',
        );
      });
    });
  });
});
