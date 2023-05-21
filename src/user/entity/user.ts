import { AggregateRoot } from '../../dddcore/aggregate.root';
import { UUID } from '../../dddcore/uuid';
import { UserCreatedEvent } from './events/user.created.event';
import { UserRenamedEvent } from './events/user.renamed.event';

export type UserID = UUID;

type UserOptions = {
  id?: string;
  username: string;
  password: string;
};

export class User extends AggregateRoot {
  private id: UserID;
  private username: string;
  private password: string;

  private constructor({ id, username, password }: UserOptions) {
    super();

    this.id = id ? UUID.build(id) : UUID.new();
    this.username = username;
    this.password = password;
  }

  static create(username: string, password: string): User {
    const user = new User({ username, password });

    user.addDomainEvent(
      new UserCreatedEvent(user.id.toString(), username, password),
    );

    return user;
  }

  static build(id: string, username: string, password: string): User {
    return new User({ id, username, password });
  }

  getID(): string {
    return this.id.toString();
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
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
}
