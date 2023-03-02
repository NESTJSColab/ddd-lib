import { DomainEvent } from '@nestjscolab/ddd';

export class PersonCreatedDomainEvent extends DomainEvent {
  constructor(readonly personId: string, readonly name: string) {
    super({
      aggregateId: personId,
      eventName: PersonCreatedDomainEvent.name,
    });
  }
}
