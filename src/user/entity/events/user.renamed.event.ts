import { DomainEvent } from '@/dddcore/domain.event';

export class UserRenamedEvent extends DomainEvent {
  private userId: string;
  private oldUsername: string;
  private newUsername: string;

  constructor(userId: string, oldUsername: string, newUsername: string) {
    super('user.renamed');

    this.userId = userId;
    this.oldUsername = oldUsername;
    this.newUsername = newUsername;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      payload: {
        user_id: this.userId,
        old_username: this.oldUsername,
        new_username: this.newUsername,
      },
    };
  }
}
