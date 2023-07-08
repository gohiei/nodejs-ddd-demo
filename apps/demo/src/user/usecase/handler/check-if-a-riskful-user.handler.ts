import { Injectable, Inject } from '@nestjs/common';
import { EVENT_BUS } from '@lib/dddcore/dddcore.constant';
import { DomainEvent } from '@lib/dddcore/domain.event';
import { EventBus, EventHandler } from '@lib/dddcore/event.bus';
import { UseCase, Output, Input } from '@lib/dddcore/usecase';
import { UserPasswordChangedEvent } from '../../entity/events/user.password.changed.event';

export abstract class CheckIfARiskfulUserUseCaseInput implements Input {
  readonly id: string;
}

export type CheckIfARiskfulUserUseCaseOutput = Output;

@Injectable()
export class CheckIfARiskfulUserUseCase implements EventHandler, UseCase {
  readonly name: string = 'user.check_if_a_riskful_user';
  readonly eventName: string = 'user.password_changed';

  constructor(@Inject(EVENT_BUS) eventBus: EventBus) {
    eventBus.register(this);
  }

  when(eventName: string, event: DomainEvent): Promise<void> {
    console.log(`${this.name} received ${eventName} : `, event.toJSON());

    const input: CheckIfARiskfulUserUseCaseInput = {
      id: (event as UserPasswordChangedEvent).getUserId(),
    };

    this.execute(input);

    return;
  }

  execute(
    input: CheckIfARiskfulUserUseCaseInput,
  ): CheckIfARiskfulUserUseCaseOutput {
    // 列入高風險
    console.log(`${this.name} received user_id : `, input.id);

    const output: CheckIfARiskfulUserUseCaseOutput = { user_id: input.id };
    return output;
  }
}
