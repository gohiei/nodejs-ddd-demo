import { Entity } from '@lib/dddcore/entity';
import {
  CompareByBlowfish,
  EncodeByAES128ECB,
  HashByBlowfish,
} from '@lib/dddcore/utility/crypto';
import { DateTime } from '@lib/dddcore/utility/datetime';
import { User } from './user';

export type UserPasswordBuildOptions = {
  user?: User;
  hash: string;
  encryptedPassword: string;
  expiredAt: Date;
  modifiedAt: Date;
  reset: boolean;
};

export class UserPassword extends Entity {
  private user: User;
  private hash: string;
  private encryptedPassword: string;
  private expiredAt: Date;
  private modifiedAt: Date;
  private reset: boolean;

  static build(params: UserPasswordBuildOptions): UserPassword {
    const {
      user,
      hash = '',
      encryptedPassword = '',
      expiredAt,
      modifiedAt,
      reset,
    } = params;
    const password = new UserPassword(user);

    password.hash = hash;
    password.encryptedPassword = encryptedPassword;

    if (expiredAt !== undefined) {
      password.expiredAt = expiredAt;
    }

    if (modifiedAt !== undefined) {
      password.modifiedAt = modifiedAt;
    }

    if (reset !== undefined) {
      password.reset = reset;
    }

    return password;
  }

  constructor(user: User) {
    super();

    this.user = user;
    this.modifiedAt = new Date();
    this.expiredAt = this.modifiedAt;
    this.reset = false;
    this.hash = '';
    this.encryptedPassword = '';
  }

  getHash(): string {
    return this.hash;
  }

  getEncryptedPassword(): string {
    return this.encryptedPassword;
  }

  getModifiedAt(): Date {
    return this.modifiedAt;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  isReset(): boolean {
    return this.reset;
  }

  isDisabled(): boolean {
    return this.hash === '';
  }

  async changePassword(
    password: string,
    reset = false,
    expireAt: Date = null,
  ): Promise<UserPassword> {
    const hash = await HashByBlowfish(password);
    const encryptedPassword = EncodeByAES128ECB(password);

    this.hash = hash;
    this.encryptedPassword = encryptedPassword;

    const now = new DateTime();
    this.modifiedAt = now.toDate();
    this.expiredAt = expireAt || now.add(30, 'days').toDate();
    this.reset = reset;

    return this;
  }

  async isValidPassword(password: string): Promise<boolean> {
    const valid = await CompareByBlowfish(password, this.hash);
    return valid;
  }
}
