import { IDomainEbIntegrationEvent } from './domain-eb-integrationevent';

export interface IDomainEbIntegrationEventBus<
  TIntegrationEvent extends IDomainEbIntegrationEvent = IDomainEbIntegrationEvent
> {
  publish<T extends TIntegrationEvent>(event: T);
  publishAll(events: TIntegrationEvent[]);
}
