import { FakeEventBus } from './fake.event.bus';

describe('FakeEventBus', () => {
  describe('when construct', () => {
    it('should be created once', () => {
      const bus1 = new FakeEventBus();
      const bus2 = new FakeEventBus();

      expect(bus1).toBe(bus2);
    });
  });
});
