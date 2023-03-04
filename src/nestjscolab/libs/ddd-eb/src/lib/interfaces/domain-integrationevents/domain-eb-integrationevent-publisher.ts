import { DomainEbIntegrationEvent } from '../../domain-eb-integrationevent';

export interface IDomainEbIntegrationEventPublisher<
  TIntegrationEvent extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
> {
  publish(integrationEvent: TIntegrationEvent): void;
  publishAll?(integrationEvent: TIntegrationEvent[]): void;
}
