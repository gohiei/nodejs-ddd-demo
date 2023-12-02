import { UUID } from './uuid';

describe('UUID', () => {
  it('it should be ok', (done) => {
    const uuid = UUID.new();
    expect(uuid).toBeDefined();
    expect(uuid.toString().length).toBeGreaterThan(10);

    const str = uuid.toString();
    const uuid2 = UUID.build(str);
    expect(uuid2).toBeDefined();

    const invalidStr = 'xxxx';

    try {
      UUID.build(invalidStr);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Invalid UUID: xxxx');
      done();
    }
  });
});
