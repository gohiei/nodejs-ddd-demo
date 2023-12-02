import { toBoolean } from './to-boolean';

describe('toBoolean', () => {
  it('should be ok', () => {
    const b1 = toBoolean(undefined);
    expect(b1).toBeUndefined();

    const b2 = toBoolean(null);
    expect(b2).toBeUndefined();

    const b3 = toBoolean('ok');
    expect(b3).toBeTruthy();

    const b4 = toBoolean('false');
    expect(b4).toBeFalsy();

    const b5 = toBoolean(123);
    expect(b5).toBeTruthy();
  });
});
