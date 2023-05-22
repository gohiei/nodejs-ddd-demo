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
  async execute(input: RenameUseCaseInput): Promise<RenameUseCaseOutput> {
    const user = await this.repo.getByID(input.id);

    user.rename(input.username);

    await this.repo.rename(user);
    await this.eventBus.postAll(user);

    const output: RenameUseCaseOutput = {
      result: 'ok',
      ret: UserDTOBuildFrom(user),
    };

    return output;
  }
}
