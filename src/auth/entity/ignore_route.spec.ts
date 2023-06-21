import { IgnoreRoute } from './ignore_route';

describe('IgnoreRoute', () => {
  it('should be ok', () => {
    expect(IgnoreRoute('GET', '/api/xxx')).toBeFalsy();
    expect(IgnoreRoute('POST', '/api/user')).toBeTruthy();
  });
});
