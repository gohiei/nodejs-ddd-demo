import { EventEmitter2EventBus } from './event.emitter2.event.bus';

describe('EventEmitter2EventBus', () => {
  describe('when construct', () => {
    it('should be created once', () => {
      const bus1 = new EventEmitter2EventBus();
      const bus2 = new EventEmitter2EventBus();

      expect(bus1).toBe(bus2);
    });
  });
});
