import { Injectable } from '@nestjs/common';
import { Input, Output } from '@/dddcore/usecase';
import { UserUseCase } from './user.usecase';
import { Exception } from '@/dddcore/error';

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

    if (newPassword !== confirmPassword) {
      throw Exception.New(
        '10006',
        'New password and confirm password are differenet',
      );
    }

    const user = await this.repo.getByID(input.id);
    const password = await this.repo.getPasswordByUser(user);

    if (password.isDisabled() && !input.isFail0821) {
      throw Exception.New(
        '10007',
        'DisabledPassword user cannot change password',
      );
    }

    // 檢查舊密碼是否輸入正確
    if (input.oldPassword && (!password.isDisabled() || !input.isFail0821)) {
      const valid = await password.isValidPassword(oldPassword);

      if (!valid) {
        throw Exception.New('10008', 'Old password is not corrent');
      }
    }

    if (!user.isMember() && input.verify) {
      const same = await password.isValidPassword(newPassword);

      if (same) {
        throw Exception.New(
          '10009',
          'New password cannot be the same as old password',
        );
      }
    }

    await this.repo.getPastPasswordByUser(user);

    // @todo get entrance from sensitive logger
    if (!isApiDomain && user.isMember()) {
      if (await user.isUsedPassword(newPassword)) {
        throw Exception.New(
          '10010',
          'New password cannot be the same as old password',
        );
      }
    }

    await user.changePassword(newPassword, passwordReset, passwordExpireAt);
    await this.repo.changePassword(user);
    await this.eventBus.postAll(user);

    return;
  }
}
