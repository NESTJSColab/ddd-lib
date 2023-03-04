import { Subject } from 'rxjs';

import { DomainEbIntegrationEvent } from '../domain-eb-integrationevent';
import {
  IDomainEbIntegrationEventMessageSource,
  IDomainEbIntegrationEventPublisher,
} from '../interfaces';

export class DomainEbDefaultIntegrationEventPublisher<
  TIntegrationEvent extends DomainEbIntegrationEvent
> implements
    IDomainEbIntegrationEventPublisher<TIntegrationEvent>,
    IDomainEbIntegrationEventMessageSource<TIntegrationEvent>
{
  constructor(private subject$: Subject<TIntegrationEvent>) {}

  publish(integrationEvent: TIntegrationEvent) {
    this.subject$.next(integrationEvent);
  }

  bridgeEventsTo(subject: Subject<TIntegrationEvent>) {
    this.subject$ = subject;
  }
}
