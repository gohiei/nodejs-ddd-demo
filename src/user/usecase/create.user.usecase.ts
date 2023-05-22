import { Input, Output } from '../../dddcore/usecase';
import { UserUseCase } from './user.usecase';
import { User } from '../entity/user';
import { UserDTO, UserDTOBuildFrom } from './dto/user.dto';

export interface CreateUserUseCaseInput extends Input {
  readonly username: string;
  readonly password: string;
}

export interface CreateUserUseCaseOutput extends Output {
  readonly result: string;
  readonly ret: UserDTO;
}

export class CreateUserUseCase extends UserUseCase {
  async execute(
    input: CreateUserUseCaseInput,
  ): Promise<CreateUserUseCaseOutput> {
    const user = User.create(input.username, input.password);

    await this.repo.add(user);
    await this.eventBus.postAll(user);

    const output: CreateUserUseCaseOutput = {
      result: 'ok',
      ret: UserDTOBuildFrom(user),
    };

    return output;
  }
}
