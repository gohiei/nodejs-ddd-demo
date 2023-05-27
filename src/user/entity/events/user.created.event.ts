import { DomainEvent } from '@/dddcore/domain.event';

export class UserCreatedEvent extends DomainEvent {
  private userId: string;
  private username: string;
  private password: string;

  constructor(userId: string, username: string, password: string) {
    super('user.created');

    this.userId = userId;
    this.username = username;
    this.password = password;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      payload: {
        user_id: this.userId,
        username: this.username,
      },
    };
  }
}
