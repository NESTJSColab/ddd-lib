import { DomainEvent } from '@nestjscolab/ddd';

export interface IDomainEsEventStore {
  saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void>;

  getEvents(aggregateId: string, aggregateName: string): Promise<DomainEvent[]>;
}
