import 'reflect-metadata';
import { v4 } from 'uuid';

import { IEbCommand } from '../interfaces';
import {
  EVENTBUS_COMMAND_HANDLER_METADATA,
  EVENTBUS_COMMAND_METADATA,
} from './domain-eb.constants';

export const DomainEbCommandHandler = (command: IEbCommand): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasMetadata(EVENTBUS_COMMAND_METADATA, command)) {
      Reflect.defineMetadata(EVENTBUS_COMMAND_METADATA, { id: v4() }, command);
    }
    Reflect.defineMetadata(EVENTBUS_COMMAND_HANDLER_METADATA, command, target);
  };
};
