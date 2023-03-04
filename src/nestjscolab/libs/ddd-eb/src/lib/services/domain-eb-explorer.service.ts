import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';

import { filterProvider, flatMap } from '../utils';
import {
  IDomainEbCommandHandler,
  IDomainEbIntegrationEvent,
  IDomainEbIntegrationEventHandler,
  IDomainEbModuleOptions,
} from '../interfaces';
import {
  DDD_EB_COMMAND_HANDLER_METADATA,
  DDD_EB_INTEGRATION_EVENTS_HANDLER_METADATA,
  DDD_EB_SAGA_METADATA,
} from '../decorators';

@Injectable()
export class DomainEbExplorerService<
  TIntegrationEvent extends IDomainEbIntegrationEvent = IDomainEbIntegrationEvent
> {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore(): IDomainEbModuleOptions {
    const modules = [...this.modulesContainer.values()];

    const domainEbCommandHandlers = flatMap<IDomainEbCommandHandler>(
      modules,
      (instance) => filterProvider(instance, DDD_EB_COMMAND_HANDLER_METADATA)
    );

    const domainEbEventHandlers = flatMap<
      IDomainEbIntegrationEventHandler<TIntegrationEvent>
    >(modules, (instance) =>
      filterProvider(instance, DDD_EB_INTEGRATION_EVENTS_HANDLER_METADATA)
    );

    const domainEbSagas = flatMap(modules, (instance) =>
      filterProvider(instance, DDD_EB_SAGA_METADATA)
    );

    return { domainEbCommandHandlers, domainEbEventHandlers, domainEbSagas };
  }
}
