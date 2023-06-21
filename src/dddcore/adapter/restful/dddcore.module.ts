import { Global, Module } from '@nestjs/common';
import { EVENT_BUS } from '../../dddcore.constant';
import { EventEmitter2EventBus } from '../event.emitter2.event.bus';

@Global()
@Module({
  providers: [
    {
      provide: EVENT_BUS,
      useClass: EventEmitter2EventBus,
    },
  ],
  exports: [EVENT_BUS],
})
export class DDDCoreModule {}
