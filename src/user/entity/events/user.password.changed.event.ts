import { DomainEvent } from '@/dddcore/domain.event';

export class UserPasswordChangedEvent extends DomainEvent {
  private userId: string;
  private username: string;

  constructor(userId: string) {
    super('user.password_changed');

    this.userId = userId;
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      payload: {
        user_id: this.userId,
      },
    };
  }
}
