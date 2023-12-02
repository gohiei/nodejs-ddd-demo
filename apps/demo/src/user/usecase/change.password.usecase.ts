import { Injectable } from '@nestjs/common';
import { Input, Output, Exception } from '@lib/dddcore/index';
import { requireTrue } from '@lib/dddcore/utility';
import { UserUseCase } from './user.usecase';
import {
  DisabledPasswordUserError,
  PasswordNotMatchError,
  SamePasswordError,
  SamePasswordError10,
  WrongOldPasswordError,
} from './errors';

export abstract class ChangePasswordUseCaseInput implements Input {
  readonly id: string;
  readonly oldPassword?: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
  readonly passwordExpireAt?: Date;
  readonly passwordReset?: boolean = false;
  readonly verify?: boolean = false;
  readonly isApiDomain?: boolean = false;
  readonly isFail0821?: boolean = false;
}

export type ChangePasswordUseCaseOutput = Output;

// @todo inject sensitive logger
// @todo inject operation logger

@Injectable()
export class ChangePasswordUseCase extends UserUseCase {
  async execute(
    input: ChangePasswordUseCaseInput,
  ): Promise<ChangePasswordUseCaseOutput> {
    const {
      newPassword,
      oldPassword,
      isApiDomain,
      passwordExpireAt,
      passwordReset,
      confirmPassword,
    } = input;

    requireTrue(newPassword === confirmPassword, PasswordNotMatchError);

    const user = await this.repo.getByID(input.id);
    const password = await this.repo.getPasswordByUser(user);

    requireTrue(
      !(password.isDisabled() && !input.isFail0821),
      DisabledPasswordUserError,
    );

    // 檢查舊密碼是否輸入正確
    if (input.oldPassword && (!password.isDisabled() || !input.isFail0821)) {
      const valid = await password.isValidPassword(oldPassword);

      requireTrue(valid, WrongOldPasswordError);
    }

    if (!user.isMember() && input.verify) {
      const same = await password.isValidPassword(newPassword);

      requireTrue(!same, SamePasswordError);
    }

    await this.repo.getPastPasswordByUser(user);

    // @todo get entrance from sensitive logger
    if (!isApiDomain && user.isMember()) {
      const same = await user.isUsedPassword(newPassword);

      requireTrue(!same, SamePasswordError10);
    }

    await user.changePassword(newPassword, passwordReset, passwordExpireAt);
    await this.repo.changePassword(user);
    await this.eventBus.postAll(user);

    return;
  }
}
