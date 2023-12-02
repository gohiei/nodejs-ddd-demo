import { DateTime, T_DATETIME_WITH_T } from './datetime';

describe('Datetime', () => {
  describe('When string is valid', () => {
    it('should be ok', () => {
      const str = '2023-12-17 00:10:20';

      const date = new DateTime(str);
      const date2 = date.add(1, 'days');

      expect(date).not.toBe(date2);
      expect(date2).toBeInstanceOf(DateTime);
      expect(date2.isValid()).toBe(true);

      const str2 = date2.format();
      expect(str2).toBe('2023-12-18 00:10:20');

      const str3 = date2.format(T_DATETIME_WITH_T);
      expect(str3).toBe('2023-12-18T00:10:20');
    });
  });

  describe('When string is invalid', () => {
    it('should be ok', () => {
      const str = '20xxxxx0';

      const date = new DateTime(str);
      expect(date.isValid()).toBeFalsy();
      expect(date.toDate()).toBeNull();

      const date2 = date.add(1, 'days');
      expect(date).not.toBe(date2);
      expect(date2).toBeInstanceOf(DateTime);
      expect(date2.isValid()).toBeFalsy();

      const str2 = date2.format();
      expect(str2).toBeNull();
    });
  });
});
