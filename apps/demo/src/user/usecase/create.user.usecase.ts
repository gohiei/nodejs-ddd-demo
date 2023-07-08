import { Input, Output, UseCase } from '@lib/dddcore/usecase';
import { User } from '../entity/user';
import { UserDTOBuildFrom } from './dto/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { EventBus } from '@lib/dddcore/event.bus';
import { IdRepository } from '../repository/id.repository';
import { UserRepository } from '../repository/user.repository';
import { ID_REPOSITORY, USER_REPOSITORY } from '../user.constant';

export interface CreateUserUseCaseInput extends Input {
  readonly username: string;
  readonly password: string;
}

export interface CreateUserUseCaseOutput extends Output {
  readonly id: string;
  readonly username: string;
  readonly user_id: number;
}

@Injectable()
export class CreateUserUseCase implements UseCase {
  protected idRepo: IdRepository;
  protected userRepo: UserRepository;
  protected eventBus: EventBus;

  constructor(
    @Inject(ID_REPOSITORY) idRepo: IdRepository,
    @Inject(USER_REPOSITORY) repo: UserRepository,
    @Inject(EVENT_BUS) eventBus: EventBus,
  ) {
    this.idRepo = idRepo;
    this.userRepo = repo;
    this.eventBus = eventBus;
  }

  async execute(
    input: CreateUserUseCaseInput,
  ): Promise<CreateUserUseCaseOutput> {
    const userID = await this.idRepo.incr(1);
    const user = await User.create(input.username, input.password, userID);

    await this.userRepo.add(user);
    await this.eventBus.postAll(user);

    const output: CreateUserUseCaseOutput = UserDTOBuildFrom(user);
    return output;
  }
}
