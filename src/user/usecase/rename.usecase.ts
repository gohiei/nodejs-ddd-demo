import { Input, Output } from '../../dddcore/usecase';
import { UserUseCase } from './user.usecase';
import { UserDTOBuildFrom, UserDTO } from './dto/user.dto';

export interface RenameUseCaseInput extends Input {
  readonly id: string;
  readonly username: string;
}

export interface RenameUseCaseOutput extends Output {
  readonly result: string;
  readonly ret: UserDTO;
}

export class RenameUseCase extends UserUseCase {
  execute(input: RenameUseCaseInput): RenameUseCaseOutput {
    const user = this.repo.getByID(input.id);

    user.rename(input.username);

    this.eventBus.postAll(user);

    const output: RenameUseCaseOutput = {
      result: 'ok',
      ret: UserDTOBuildFrom(user),
    };

    return output;
  }
}
