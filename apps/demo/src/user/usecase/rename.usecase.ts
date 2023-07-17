import { Injectable } from '@nestjs/common';
import { Input, Output } from '@lib/dddcore/index';
import { UserUseCase } from './user.usecase';
import { UserDTOBuildFrom } from './dto/user.dto';

export interface RenameUseCaseInput extends Input {
  readonly id: string;
  readonly username: string;
}

export interface RenameUseCaseOutput extends Output {
  readonly id: string;
  readonly username: string;
}

@Injectable()
export class RenameUseCase extends UserUseCase {
  async execute(input: RenameUseCaseInput): Promise<RenameUseCaseOutput> {
    const user = await this.repo.getByID(input.id);

    user.rename(input.username);

    await this.repo.rename(user);
    await this.eventBus.postAll(user);

    const output: RenameUseCaseOutput = UserDTOBuildFrom(user);
    return output;
  }
}
