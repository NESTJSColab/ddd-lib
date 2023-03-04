import { Subject } from 'rxjs';

import { IDomainEbIntegrationEvent } from './domain-eb-integrationevent';

export interface IDomainEbIntegrationEventMessageSource<
  TIntegrationEvent extends IDomainEbIntegrationEvent = IDomainEbIntegrationEvent
> {
  bridgeEventsTo(subject: Subject<TIntegrationEvent>): any;
}
