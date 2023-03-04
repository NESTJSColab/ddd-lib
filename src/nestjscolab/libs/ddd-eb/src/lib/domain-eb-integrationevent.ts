import { v4 } from 'uuid';

import { IDomainEbIntegrationEvent } from './interfaces/domain-integrationevents/domain-eb-integrationevent';

export abstract class DomainEbIntegrationEvent
  implements IDomainEbIntegrationEvent
{
  readonly id: string;
  readonly ocurredOn: string;

  constructor() {
    this.id = v4();
    this.ocurredOn = new Date().toISOString();
  }
}
