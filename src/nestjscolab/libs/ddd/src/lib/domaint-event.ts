import { IDomainEvent } from './interfaces';
import { DomainUuidValueObject } from './value-object';

export abstract class DomainEvent implements IDomainEvent {
  readonly id: string;
  readonly eventType: 'DOMAIN_EVENT';
  readonly eventName: string;
  readonly version: number;
  readonly aggregateId: string;
  readonly occurredOn: string;
  readonly eventData?: string;

  constructor(params: { aggregateId: string; eventName: string }) {
    const { aggregateId, eventName } = params;
    this.id = DomainUuidValueObject.generate().unpack();

    this.aggregateId = aggregateId;
    this.occurredOn = new Date().toUTCString();
    this.eventName = eventName;
  }
}
