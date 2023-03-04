import { IDomainEbIntegrationEvent } from './domain-eb-integrationevent';

export interface IDomainEbIntegrationEventHandler<
  TIntegrationEvent extends IDomainEbIntegrationEvent
> {
  handle(event: TIntegrationEvent): Promise<void>;
}
