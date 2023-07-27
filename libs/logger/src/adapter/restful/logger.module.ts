import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { loggerProviders } from './logger.provider';
import { LoggingMiddleware } from './logger.middleware';
import { LogAccessUseCase } from '../../usecase/log.access.usecase';
import { LogErrorUseCase } from '../../usecase/log.error.usecase';
import { LogPostUseCase } from '../../usecase/log.post.usecase';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggerInterceptor } from './logger.interceptor';
import { LogHTTPRequestUseCase } from '../../usecase/log.http_request.usecase';
import { RealClientIP } from './real.client.ip';

@Module({
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
    RealClientIP,
  ],
  exports: [LogErrorUseCase],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
