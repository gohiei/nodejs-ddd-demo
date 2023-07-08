import { JwtToken } from './jwt_token.entity';

describe('JwtToken Entity', () => {
  it('should return `true`', () => {
    const token =
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA';

    const t = new JwtToken(token, {
      ip: '127.0.0.1',
      xff: '-',
      method: 'POST',
      url: '/api/xxx',
    });

    const [valid, err] = t.isValid();

    expect(valid).toBeTruthy();
    expect(err).toBeNull();
  });

  it('should return `false`', () => {
    const token =
      'Bearer eyJhbGciOiJIUzI1NJ9.eyJpYXQiOjE2ODYyMzkwMjIsImV4cCI6MTExNTQzMjgyNDJ9.xiUZiaKW1GtFNTt6bWJo0lv8ci2NijZgJQzGAxOTFXA';

    const t = new JwtToken(token, {
      ip: '127.0.0.1',
      xff: '-',
      method: 'POST',
      url: '/api/xxx',
    });

    const [valid, err] = t.isValid();

    expect(valid).toBeFalsy();
    expect(err).toBeDefined();
    expect(err.message).toBe('invalid token');
  });
});
