import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { DomainEbCommandBus } from './domain-eb-command-bus';
import { DomainEbIntegrationEventBus } from './domain-eb-bus';
import { DomainEbIntegrationEventPublisher } from './domain-eb-publisher';
import { DomainEbExplorerService } from './services';
import { DomainEbIntegrationEvent } from './domain-eb-integrationevent';

@Module({
  controllers: [],
  providers: [
    DomainEbCommandBus,
    DomainEbIntegrationEventBus,
    DomainEbIntegrationEventPublisher,
    DomainEbExplorerService,
  ],
  exports: [
    DomainEbIntegrationEvent,
    DomainEbCommandBus,
    DomainEbIntegrationEventBus,
    DomainEbIntegrationEventPublisher,
    DomainEbExplorerService,
  ],
})
export class DddEbModule<
  TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
> implements OnApplicationBootstrap
{
  constructor(
    private readonly explorerService: DomainEbExplorerService<TEventBase>,
    private readonly integrationEventsBus: DomainEbIntegrationEventBus<TEventBase>,
    private readonly commandsBus: DomainEbCommandBus
  ) {}

  onApplicationBootstrap() {
    const { domainEbEventHandlers, domainEbSagas, domainEbCommandHandlers } =
      this.explorerService.explore();

    this.commandsBus.register(domainEbCommandHandlers);
    this.integrationEventsBus.register(domainEbEventHandlers);
    this.integrationEventsBus.registerSagas(domainEbSagas);
  }
}
