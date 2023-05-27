import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { loggerProviders } from './logger.provider';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './logger.middleware';
import { AccessLogger } from './usecase/access.logger';
import { ErrorLogger } from './usecase/error.logger';
import { PostLogger } from './usecase/post.logger';
import { EventEmitter2EventBus } from '@/dddcore/adapter/event.emitter2.event.bus';
import { EVENT_BUS } from '@/dddcore/dddcore.constant';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: EventEmitter2EventBus,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ...loggerProviders,
    AccessLogger,
    PostLogger,
    ErrorLogger,
  ],
  exports: [ErrorLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
