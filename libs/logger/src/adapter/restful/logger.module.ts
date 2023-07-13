import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2EventBus } from '@lib/dddcore/adapter/event.emitter2.event.bus';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';

import { loggerProviders } from './logger.provider';
import { LoggingMiddleware } from './logger.middleware';
import { LogAccessUseCase } from '../../usecase/log.access.usecase';
import { LogErrorUseCase } from '../../usecase/log.error.usecase';
import { LogPostUseCase } from '../../usecase/log.post.usecase';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggerInterceptor } from './logger.interceptor';
import { LogHTTPRequestUseCase } from '../../usecase/log.http_request.usecase';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    ...loggerProviders,
    LogAccessUseCase,
    LogPostUseCase,
    LogErrorUseCase,
    LogHTTPRequestUseCase,
  ],
  exports: [LogErrorUseCase],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
