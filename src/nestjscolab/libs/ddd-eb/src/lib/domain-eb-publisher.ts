import { Injectable } from '@nestjs/common';
import { DomainEbIntegrationEvent } from './domain-eb-integrationevent';
import { DomainEbIntegrationEventBus } from './domain-eb-bus';

@Injectable()
export class DomainEbIntegrationEventPublisher<
  TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
> {
  constructor(
    private readonly integrationEventBus: DomainEbIntegrationEventBus<TEventBase>
  ) {}

  publish(event: TEventBase) {
    this.integrationEventBus.publish(event);
  }

  publishAll(events: TEventBase[]) {
    this.integrationEventBus.publishAll(events);
  }
}
