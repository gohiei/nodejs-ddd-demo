import { Input, Output, UseCase } from '../../dddcore/usecase';
import { EventBus } from '../../dddcore/event.bus';
import { UserRepository } from '../repository/user.repository';

export abstract class UserUseCase implements UseCase {
  protected repo: UserRepository;
  protected eventBus: EventBus;

  constructor(repo: UserRepository, eventBus: EventBus) {
    this.repo = repo;
    this.eventBus = eventBus;
  }

  abstract execute(input: Input): Output;
}
