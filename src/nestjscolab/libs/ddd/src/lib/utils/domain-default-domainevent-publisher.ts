import { Subject } from 'rxjs';

import { DomainEvent } from '../domaint-event';
import {
  IDomainEventMessageSource,
  IDomainEventPublisher,
} from '../interfaces';

export class DomainDefaultEventPublisher<TDomainEvent extends DomainEvent>
  implements
    IDomainEventPublisher<TDomainEvent>,
    IDomainEventMessageSource<TDomainEvent>
{
  constructor(private subject$: Subject<TDomainEvent>) {}

  publish(event: TDomainEvent) {
    this.subject$.next(event);
  }

  bridgeEventsTo(subject: Subject<TDomainEvent>) {
    this.subject$ = subject;
  }
}
