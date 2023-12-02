import { randomString } from './random';

describe('random', () => {
  describe('randomString', () => {
    it('should be ok', async () => {
      const str = await randomString(2);
      expect(str).toBeDefined();
      expect(str.length).toBe(2);

      let err;

      try {
        await randomString(-1);
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
    });
  });
});
