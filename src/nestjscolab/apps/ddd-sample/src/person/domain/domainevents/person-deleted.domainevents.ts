import { DomainEvent } from '@nestjscolab/ddd';

export class PersonDeletedDomainEvent extends DomainEvent {
  constructor(readonly personId: string, readonly name: string) {
    super({
      aggregateId: personId,
      eventName: PersonDeletedDomainEvent.name,
    });
  }
}
