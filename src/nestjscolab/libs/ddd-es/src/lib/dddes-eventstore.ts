import { DddEvent, Guard } from 'nestjscolab.ddd'
import { Injectable } from '@nestjs/common'

import { DddEsConcurrencyException, DddEsException } from './exceptions'
import { IDddEsEventStore } from './interfaces'
import { EventRecordStore } from './database'
import { DddEsRecordRepository } from './infrastructure'
import { RecordStoreEvent } from './models/record-store.event'

@Injectable()
export class DddEsEventStore implements IDddEsEventStore {
  private _current = new Map<string, EventRecordStore[]>()

  constructor(private readonly repository: DddEsRecordRepository) {}

  async getEvents(id: string, aggregate: string): Promise<RecordStoreEvent[]> {
    const events = await this.repository
  }

  async SsaveEvents(
    aggregateId: string,
    events: DddEvent[],
    expectedVersion: number
  ): Promise<void> {
    let eventsFromCurrent: EventRecordStore[]

    if (aggregateId === null || aggregateId.length === 0)
      throw new DddEsException('AgregateId cannot be null or empty')

    eventsFromCurrent = await this.repository.findByAggregateId(aggregateId)

    if (!eventsFromCurrent) {
      eventsFromCurrent = []
      this._current.set(aggregateId, eventsFromCurrent)
    } else if (
      eventsFromCurrent[eventsFromCurrent.length - 1].version !==
        expectedVersion &&
      expectedVersion !== -1
    ) {
      throw new DddEsConcurrencyException(
        `Version: ${expectedVersion} is not valid`
      )
    }

    let version = expectedVersion

    // TODO: Implement mapper
    events.forEach(async event => {
      version++

      const record = new EventRecordStore()
      record.ocurredOn = event.occurredOn
      record.aggregateId = aggregateId
      record.eventId = event.id
      record.eventType = event.eventType
      record.eventName = event.eventName
      record.version = version
      record.eventData = JSON.stringify(event)

      await this.repository.save(record)

      // TODO: Implement conditional publisher
      //await this.publisher.send()
    })
  }

  async SgetEvents(
    aggregateId: string,
    aggregateName: string
  ): Promise<RecordStoreEvent[]> {
    if (Guard.isEmpty(aggregateId))
      throw new DddEsException(
        `AggregateId: ${aggregateId} is not valid or empty`
      )

    const eventsFromRecord = await this.repository.findByAggregateId(
      aggregateId
    )

    if (!eventsFromRecord)
      throw new DddEsException(
        `Events for aggregateId: ${aggregateId} cannot be found`
      )

    const result: DddEvent[] = []
    // TODO: Refactoring
    eventsFromRecord
      .sort(e => e.version)
      .forEach(event => {
        const eventMapped: DddEvent = {
          aggregateId: event.aggregateId,
          id: event.eventId,
          eventType: event.eventType,
          eventName: event.eventName,
          version: event.version,
          eventData: event.eventData,
          occurredOn: event.ocurredOn,
        } as DddEvent

        result.push(eventMapped)
      })

    return result
  }
}
