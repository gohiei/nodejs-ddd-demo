import { Input, Output, UseCase } from '../../dddcore/usecase';
import { EventBus } from '../../dddcore/event.bus';
import { UserRepository } from '../repository/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { EVENT_BUS } from '../../dddcore/dddcore.constant';
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
