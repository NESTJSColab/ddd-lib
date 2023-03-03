import { Injectable } from '@nestjs/common';
import { IDomainEsEventStore } from './interfaces/domain-es.interface';
import { DomainEsRecord } from './database/collections/domain-es-record.collection';
import { DomainEsRecordRepository } from './infrastructure';
import { DomainEsConcurrencyException, DomainEsException } from './exceptions';
import { DomainEvent } from '@nestjscolab/ddd';
import { Guard } from 'nestjscolab.ddd';

@Injectable()
export class DomainEsEventStore implements IDomainEsEventStore {
  private _current = new Map<string, DomainEsRecord[]>();

  constructor(private readonly repository: DomainEsRecordRepository) {}

  async getEvents(id: string, aggregate: string): Promise<DomainEsRecord[]> {
    //
    return null;
  }

  async SsaveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    let eventsFromCurrent: DomainEsRecord[];

    if (aggregateId === null || aggregateId.length === 0)
      throw new DomainEsException('AgregateId cannot be null or empty');

    eventsFromCurrent = await this.repository.getEvent(0);

    if (!eventsFromCurrent) {
      eventsFromCurrent = [];
      this._current.set(aggregateId, eventsFromCurrent);
    } else if (
      eventsFromCurrent[eventsFromCurrent.length - 1].version !==
        expectedVersion &&
      expectedVersion !== -1
    ) {
      throw new DomainEsConcurrencyException(
        `Version: ${expectedVersion} is not valid`
      );
    }

    let version = expectedVersion;

    // TODO: Implement mapper
    events.forEach(async (event) => {
      version++;

      const record = new EventRecordStore();
      record.ocurredOn = event.occurredOn;
      record.aggregateId = aggregateId;
      record.eventId = event.id;
      record.eventType = event.eventType;
      record.eventName = event.eventName;
      record.version = version;
      record.eventData = JSON.stringify(event);

      await this.repository.save(record);

      // TODO: Implement conditional publisher
      //await this.publisher.send()
    });
  }

  async SgetEvents(
    aggregateId: string,
    aggregateName: string
  ): Promise<DomainEsRecord[]> {
    if (Guard.isEmpty(aggregateId))
      throw new DomainEsException(
        `AggregateId: ${aggregateId} is not valid or empty`
      );

    const eventsFromRecord = await this.repository.getEvent(0);

    if (!eventsFromRecord)
      throw new DomainEsException(
        `Events for aggregateId: ${aggregateId} cannot be found`
      );

    // const result: DddEvent[] = [];
    // // TODO: Refactoring
    // eventsFromRecord
    //   .sort((e) => e.version)
    //   .forEach((event) => {
    //     const eventMapped: DomainEvent = {
    //       aggregateId: event.aggregateId,
    //       id: event.eventId,
    //       eventType: event.eventType,
    //       eventName: event.eventName,
    //       version: event.version,
    //       eventData: event.eventData,
    //       occurredOn: event.ocurredOn,
    //     } as DEvent;

    //     result.push(eventMapped);
    //   });

    return null;
  }
}
