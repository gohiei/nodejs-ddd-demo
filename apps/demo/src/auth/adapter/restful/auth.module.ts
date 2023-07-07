import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { CheckAuthorizationUseCase } from '../../usecase/check.authorization.usecase';

@Module({
  providers: [CheckAuthorizationUseCase],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
