import { AggregateRoot } from '@/dddcore/aggregate.root';
import { UUID } from '@/dddcore/utility/uuid';
import { UserCreatedEvent } from './events/user.created.event';
import { UserPasswordChangedEvent } from './events/user.password.changed.event';
import { UserRenamedEvent } from './events/user.renamed.event';
import { PastUserPassword } from './past.user.password';
import { UserPassword, UserPasswordBuildOptions } from './user.password';

export type UserID = UUID;

type UserOptions = {
  id?: string;
  username: string;
  password: string;
  role?: UserRole;
  userID?: number;
};

export enum UserRole {
  Member = 1,
  Agent = 2,
}

export class User extends AggregateRoot {
  private id: UserID;
  private userID: number;
  private username: string;
  private password: string;
  private role: UserRole = UserRole.Member;
  private userPassword: UserPassword;
  private pastUserPassword: PastUserPassword;

  private constructor({
    id,
    userID,
    username,
    password,
    role = UserRole.Member,
  }: UserOptions) {
    super();

    this.id = id ? UUID.build(id) : UUID.new();
    this.username = username;
    this.password = password;
    this.role = role;
    this.userID = userID;
  }

  static async create(
    username: string,
    password: string,
    userID = 0,
  ): Promise<User> {
    const user = new User({ username, password, userID });

    user.userPassword = new UserPassword(user);
    await user.userPassword.changePassword(password, false);

    user.addDomainEvent(
      new UserCreatedEvent(user.id.toString(), username, password, userID),
    );

    return user;
  }

  static build(options: UserOptions): User {
    return new User(options);
  }

  getID(): string {
    return this.id.toString();
  }

  getUserID(): number {
    return this.userID;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  isMember(): boolean {
    return this.role === UserRole.Member;
  }

  rename(username: string): User {
    const oldName = this.username;
    const newName = username;

    this.username = newName;

    this.addDomainEvent(
      new UserRenamedEvent(this.id.toString(), oldName, newName),
    );

    return this;
  }

  buildUserPassword(params: UserPasswordBuildOptions): UserPassword {
    this.userPassword = UserPassword.build({
      ...params,
      user: this,
    });

    return this.userPassword;
  }

  buildPastUserPassword({ hash2 = '', hash3 = '' }): PastUserPassword {
    this.pastUserPassword = new PastUserPassword({ user: this, hash2, hash3 });
    return this.pastUserPassword;
  }

  getUserPassword(): UserPassword {
    return this.userPassword;
  }

  getPastUserPassword(): PastUserPassword {
    return this.pastUserPassword;
  }

  /**
   * 變更密碼
   *
   * @param password
   * @param mustReset 必須請使用者重置密碼
   * @returns
   */
  async changePassword(
    password: string,
    mustReset = false,
    expireAt: Date = null,
  ): Promise<User> {
    const oldHash = this.userPassword.getHash();

    await this.getUserPassword().changePassword(password, mustReset, expireAt);
    this.password = '';

    if (this.isMember()) {
      if (!this.pastUserPassword) {
        this.pastUserPassword = new PastUserPassword({ user: this });
      }

      this.pastUserPassword.saveOldPassword(oldHash);
    }

    this.addDomainEvent(new UserPasswordChangedEvent(this.id.toString()));

    return this;
  }

  /**
   * 確認新密碼近期是否使用過
   *
   * @param newPassword
   * @returns
   */
  async isUsedPassword(newPassword): Promise<boolean> {
    if (!this.pastUserPassword) {
      return false;
    }

    const used = await this.getUserPassword().isValidPassword(newPassword);

    if (used) {
      return used;
    }

    return await this.getPastUserPassword().isUsed(newPassword);
  }
}
