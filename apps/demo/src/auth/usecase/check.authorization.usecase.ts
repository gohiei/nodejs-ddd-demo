import { Input, Output, UseCase } from '@lib/dddcore/usecase';
import { JwtToken } from '../entity/jwt_token.entity';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { EventBus } from '@lib/dddcore/event.bus';
import { Exception } from '@lib/dddcore/error';
import { IgnoreRoute } from '../entity/ignore_route';

export abstract class CheckAuthorizationUseCaseInput implements Input {
  readonly token: string;
  readonly ip: string;
  readonly xff: string;
  readonly method: string;
  readonly url: string;
}

export abstract class CheckAuthorizationUseCaseOutput implements Output {
  readonly valid: boolean;
}

@Injectable()
export class CheckAuthorizationUseCase implements UseCase {
  private eventBus: EventBus;

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  async execute(
    input: CheckAuthorizationUseCaseInput,
  ): Promise<CheckAuthorizationUseCaseOutput> {
    if (IgnoreRoute(input.method, input.url)) {
      return Promise.resolve({ valid: true });
    }

    const jwtToken = new JwtToken(input.token, {
      ip: input.ip,
      xff: input.xff,
      method: input.method,
      url: input.url,
    });

    const [valid, err] = jwtToken.isValid();

    if (!valid) {
      this.eventBus.postAll(jwtToken);
      throw Exception.NewS('00001', err.message, HttpStatus.FORBIDDEN);
    }

    return Promise.resolve({ valid });
  }
}
