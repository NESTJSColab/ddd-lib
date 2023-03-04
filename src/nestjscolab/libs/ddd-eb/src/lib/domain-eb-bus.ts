import { DDD_EB_INTEGRATION_EVENTS_HANDLER_METADATA } from './decorators/domain-eb.constants';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, OnModuleDestroy, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { from, Observable, Subscription } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { isFunction } from 'util';
import { DomainEbIntegrationEvent } from './domain-eb-integrationevent';
import {
  IDomainEbIntegrationEventBus,
  IDomainEbIntegrationEventHandler,
  IDomainEbIntegrationEventPublisher,
  IDomainEbIntegrationEventSaga,
} from './interfaces';
import {
  DomainEbDefaultIntegrationEventPublisher,
  DomainEbObservableBus,
  domainEbDefaultGetIntegrationEventId,
  domainEbDefaultReflectIntegrationEventId,
} from './utils';
import { DomainEbCommandBus } from './domain-eb-command-bus';
import { DDD_EB_SAGA_METADATA } from './decorators';
import { DomainEbException } from './exceptions';

export type DomainEbIntegrationEventHandlerType<
  TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
> = Type<IDomainEbIntegrationEventHandler<TEventBase>>;

@Injectable()
export class DomainEbIntegrationEventBus<
    TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
  >
  extends DomainEbObservableBus<TEventBase>
  implements IDomainEbIntegrationEventBus<TEventBase>, OnModuleDestroy
{
  protected getIntegrationEventId: (event: TEventBase) => string | null;
  protected readonly subscriptions: Subscription[];
  private _publisher: IDomainEbIntegrationEventPublisher<TEventBase>;
  private readonly _logger = new Logger(DomainEbIntegrationEventBus.name);

  constructor(
    private readonly commandBus: DomainEbCommandBus,
    private readonly moduleRef: ModuleRef
  ) {
    super();
    this.subscriptions = [];
    this.getIntegrationEventId = domainEbDefaultGetIntegrationEventId;
    this.useDefaultPublisher();
  }

  get publisher(): IDomainEbIntegrationEventPublisher<TEventBase> {
    return this._publisher;
  }

  set publisher(_publisher: IDomainEbIntegrationEventPublisher<TEventBase>) {
    this._publisher = _publisher;
  }

  onModuleDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  publish<T extends TEventBase>(event: T) {
    return this._publisher.publish(event);
  }

  publishAll<T extends TEventBase>(events: T[]) {
    if (this._publisher.publishAll) {
      return this._publisher.publishAll(events);
    }
    return (events || []).map((event) => this._publisher.publish(event));
  }

  bind(handler: IDomainEbIntegrationEventHandler<TEventBase>, id: string) {
    const stream$ = id ? this.ofEventId(id) : this.subject$;
    const subscription = stream$
      .pipe(mergeMap((event) => from(Promise.resolve(handler.handle(event)))))
      .subscribe({
        error: (error) => {
          this._logger.error(
            `"${handler.constructor.name}" has thrown an error.`,
            error
          );
          throw error;
        },
      });
    this.subscriptions.push(subscription);
  }

  registerSagas(types: Type<unknown>[] = []) {
    const sagas = types
      .map((target) => {
        const metadata =
          Reflect.getMetadata(DDD_EB_SAGA_METADATA, target) || [];
        const instance = this.moduleRef.get(target, { strict: false });
        if (!instance) {
          throw new DomainEbException('Instance does not exists');
        }
        return metadata.map((key: string) => instance[key].bind(instance));
      })
      .reduce((a, b) => a.concat(b), []);

    sagas.forEach((saga) => this.registerSaga(saga));
  }

  register(handlers: DomainEbIntegrationEventHandlerType<TEventBase>[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(
    handler: DomainEbIntegrationEventHandlerType<TEventBase>
  ) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const events = this.reflectEvents(handler);
    events.map((event: any) =>
      this.bind(
        instance as IDomainEbIntegrationEventHandler<TEventBase>,
        domainEbDefaultReflectIntegrationEventId(event)
      )
    );
  }

  protected ofEventId(id: string) {
    return this.subject$.pipe(
      filter((event) => this.getIntegrationEventId(event) === id)
    );
  }

  protected registerSaga(saga: IDomainEbIntegrationEventSaga<TEventBase>) {
    if (!isFunction(saga)) {
      throw new DomainEbException('Saga is not a function');
    }
    const stream$ = saga(this);
    if (!(stream$ instanceof Observable)) {
      throw new DomainEbException('Stream is not an Observable type');
    }

    const subscription = stream$
      .pipe(
        filter((e) => !!e),
        mergeMap((command) => from(this.commandBus.execute(command)))
      )
      .subscribe({
        error: (error) => {
          this._logger.error(
            `Command handler which execution was triggered by Saga has thrown an error.`,
            error
          );
          throw error;
        },
      });

    this.subscriptions.push(subscription);
  }

  private reflectEvents(
    handler: DomainEbIntegrationEventHandlerType<TEventBase>
  ): FunctionConstructor[] {
    return Reflect.getMetadata(
      DDD_EB_INTEGRATION_EVENTS_HANDLER_METADATA,
      handler
    );
  }

  private useDefaultPublisher() {
    this._publisher = new DomainEbDefaultIntegrationEventPublisher<TEventBase>(
      this.subject$
    );
  }
}
