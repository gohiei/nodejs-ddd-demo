import {
  CompareByBlowfish,
  DecodeByAES128ECB,
  EncodeByAES128ECB,
  HashByBlowfish,
} from './crypto';

describe('crypto', () => {
  describe('Hash/Compare by Blowfish', () => {
    it('should return ok', async () => {
      const data = '1234';
      const hash = await HashByBlowfish(data);

      expect(hash).not.toBeNull();

      const retTrue = await CompareByBlowfish(data, hash);
      expect(retTrue).toBeTruthy();

      const retFalse = await CompareByBlowfish('4321', hash);
      expect(retFalse).toBeFalsy();
    });
  });

  describe('Encode/Decode by AES128ECB', () => {
    it('should return ok', () => {
      const data = '1234';
      const ret = EncodeByAES128ECB(data);

      expect(ret).not.toBeNull();

      const decoded = DecodeByAES128ECB(ret);

      expect(decoded).toBe(data);
    });
  });
});
