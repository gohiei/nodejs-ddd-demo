import { Entity } from '@lib/dddcore/index';
import { CompareByBlowfish } from '@lib/dddcore/utility/index';
import { User } from './user';

export class PastUserPassword extends Entity {
  private user: User;
  private hash2: string;
  private hash3: string;

  constructor({ user, hash2 = '', hash3 = '' }) {
    super();

    this.user = user;
    this.hash2 = hash2;
    this.hash3 = hash3;
  }

  getHash2() {
    return this.hash2;
  }
  getHash3() {
    return this.hash3;
  }

  async isUsed(password: string): Promise<boolean> {
    if (this.hash2 !== '') {
      const same = await CompareByBlowfish(password, this.hash2);

      if (same) {
        return same;
      }
    }

    if (this.hash3 !== '') {
      return await CompareByBlowfish(password, this.hash3);
    }

    return false;
  }

  saveOldPassword(oldHash: string): PastUserPassword {
    const hash2 = this.hash2;
    this.hash3 = hash2;
    this.hash2 = oldHash;

    return this;
  }
}
