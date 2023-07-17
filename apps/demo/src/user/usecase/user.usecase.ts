import { Inject, Injectable } from '@nestjs/common';
import {
  Input,
  Output,
  UseCase,
  EventBus,
  EVENT_BUS,
} from '@lib/dddcore/index';
import { UserRepository } from '../repository/user.repository';
import { USER_REPOSITORY } from '../user.constant';

@Injectable()
export abstract class UserUseCase implements UseCase {
  protected repo: UserRepository;
  protected eventBus: EventBus;

  constructor(
    @Inject(USER_REPOSITORY)
    repo: UserRepository,

    @Inject(EVENT_BUS)
    eventBus: EventBus,
  ) {
    this.repo = repo;
    this.eventBus = eventBus;
  }

  abstract execute(input: Input): Output;
}
