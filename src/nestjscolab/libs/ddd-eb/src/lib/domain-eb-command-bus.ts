/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  IDomainEbCommand,
  IDomainEbCommandBus,
  IDomainEbCommandHandler,
  IDomainEbCommandMetadata,
  IDomainEbCommandPublisher,
} from './interfaces';
import {
  DomainEbDefaultCommandPublisher,
  DomainEbObservableBus,
} from './utils';
import { DomainEbException } from './exceptions';
import {
  DDD_EB_COMMAND_HANDLER_METADATA,
  DDD_EB_COMMAND_METADATA,
} from './decorators';

export type DomainEbCommandHandlerType = Type<
  IDomainEbCommandHandler<IDomainEbCommand>
>;

@Injectable()
export class DomainEbCommandBus<
    CommandBase extends IDomainEbCommand = IDomainEbCommand
  >
  extends DomainEbObservableBus<CommandBase>
  implements IDomainEbCommandBus<CommandBase>
{
  private _handlers = new Map<string, IDomainEbCommandHandler<CommandBase>>();
  private _publisher: IDomainEbCommandPublisher<CommandBase>;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
    this.useDefaultPublisher();
  }

  get getDomainEbCommandPublisher(): IDomainEbCommandPublisher<CommandBase> {
    return this._publisher;
  }

  set setDomainEbCommandPublisher(
    _publisher: IDomainEbCommandPublisher<CommandBase>
  ) {
    this._publisher = _publisher;
  }

  execute<T extends CommandBase, R = any>(command: T): any {
    const commandId = this.getCommandId(command);
    const handler = this._handlers.get(commandId);
    if (!handler) {
      throw new DomainEbException(commandId);
    }
    this._publisher.publish(command);

    handler.execute(command);
  }

  bind<T extends CommandBase>(handler: IDomainEbCommandHandler<T>, id: string) {
    this._handlers.set(id, handler);
  }

  register(handlers: DomainEbCommandHandlerType[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: DomainEbCommandHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = this.reflectCommandId(handler);
    if (!target) {
      throw new DomainEbException('Target does not exists');
    }
    this.bind(instance as IDomainEbCommandHandler<CommandBase>, target);
  }

  private getCommandId(command: CommandBase): string {
    const { constructor: commandType } = Object.getPrototypeOf(command);
    const commandMetadata: IDomainEbCommandMetadata = Reflect.getMetadata(
      DDD_EB_COMMAND_METADATA,
      commandType
    );
    if (!commandMetadata) {
      throw new DomainEbException(commandType.name);
    }

    return commandMetadata.id;
  }

  private reflectCommandId(
    handler: DomainEbCommandHandlerType
  ): string | undefined {
    const command: Type<IDomainEbCommand> = Reflect.getMetadata(
      DDD_EB_COMMAND_HANDLER_METADATA,
      handler
    );
    const commandMetadata: IDomainEbCommandMetadata = Reflect.getMetadata(
      DDD_EB_COMMAND_METADATA,
      command
    );
    return commandMetadata.id;
  }

  private useDefaultPublisher() {
    this._publisher = new DomainEbDefaultCommandPublisher<CommandBase>(
      this.subject$
    );
  }
}
