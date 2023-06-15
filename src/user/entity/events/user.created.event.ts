import { DomainEvent } from '@/dddcore/domain.event';

export class UserCreatedEvent extends DomainEvent {
  private userId: string;
  private username: string;
  private password: string;
  private userIntID: number;

  constructor(
    userId: string,
    username: string,
    password: string,
    userIntID: number,
  ) {
    super('user.created');

    this.userId = userId;
    this.username = username;
    this.password = password;
    this.userIntID = userIntID;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      payload: {
        user_id: this.userId,
        username: this.username,
        user_int_id: this.userIntID,
      },
    };
  }
}
