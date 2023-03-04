import { Type } from '@nestjs/common';

import { IDomainEbIntegrationEvent } from '../interfaces';
import { DomainEbIntegrationEvent } from '../domain-eb-integrationevent';
import { DDD_EB_INTEGRATION_EVENT_HANDLER_METADATA } from '../decorators';

export const domainEbDefaultGetIntegrationEventId = <
  TIntegrationEvent extends IDomainEbIntegrationEvent = IDomainEbIntegrationEvent
>(
  integrationEvent: TIntegrationEvent
): string => {
  const { constructor } = Object.getPrototypeOf(integrationEvent);
  return (
    Reflect.getMetadata(DDD_EB_INTEGRATION_EVENT_HANDLER_METADATA, constructor)
      ?.id ?? null
  );
};

export const domainEbDefaultReflectIntegrationEventId = <
  TIntegrationEvent extends Type<DomainEbIntegrationEvent> = Type<DomainEbIntegrationEvent>
>(
  integrationEvent: TIntegrationEvent
): string => {
  return Reflect.getMetadata(
    DDD_EB_INTEGRATION_EVENT_HANDLER_METADATA,
    integrationEvent
  ).id;
};
