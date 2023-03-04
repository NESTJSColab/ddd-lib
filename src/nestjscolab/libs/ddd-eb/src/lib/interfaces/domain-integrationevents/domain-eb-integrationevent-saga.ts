import { Observable } from 'rxjs';

import { DomainEbIntegrationEvent } from '../../domain-eb-integrationevent';
import { IDomainEbCommand } from '../domain-commands';

export type IDomainEbIntegrationEventSaga<
  TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent,
  CommandBase extends IDomainEbCommand = IDomainEbCommand
> = (integrationEvents$: Observable<TEventBase>) => Observable<CommandBase>;
