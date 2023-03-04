import { Type } from '@nestjs/common';
import {
  IDomainEbIntegrationEvent,
  IDomainEbIntegrationEventHandler,
} from './domain-integrationevents';
import { IDomainEbCommandHandler } from './domain-commands';

export interface IDomainEbModuleOptions {
  domainEbEventHandlers?: Type<
    IDomainEbIntegrationEventHandler<IDomainEbIntegrationEvent>
  >[];
  domainEbCommandHandlers?: Type<IDomainEbCommandHandler>[];
  domainEbSagas?: Type<any>[];
}
