import { Type } from '@nestjs/common';

import { DDD_DOMAIN_EVENT_METADATA } from '../decorators';
import { DomainEvent } from '../domaint-event';

export const getDefaultDomainEventId = <
  TDomainEvent extends DomainEvent = DomainEvent
>(
  domainEvent: TDomainEvent
): string => {
  const { constructor } = Object.getPrototypeOf(domainEvent);
  return (
    Reflect.getMetadata(DDD_DOMAIN_EVENT_METADATA, constructor)?.id ?? null
  );
};

export const getDefaultReflectDomainEventId = <
  TDomainEvent extends Type<DomainEvent> = Type<DomainEvent>
>(
  domainEvent: TDomainEvent
): string => {
  return Reflect.getMetadata(DDD_DOMAIN_EVENT_METADATA, domainEvent).id;
};
