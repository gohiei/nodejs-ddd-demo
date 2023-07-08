import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';
import { EVENT_BUS } from '../../dddcore.constant';
import { EventEmitter2EventBus } from '../event.emitter2.event.bus';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: EventEmitter2EventBus,
    },
  ],
  exports: [EVENT_BUS],
})
export class DDDCoreModule {}
