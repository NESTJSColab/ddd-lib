import 'reflect-metadata';
import { EVENTBUS_SAGA_METADATA } from '../constants';

export const EventBuSaga = (): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    const properties =
      Reflect.getMetadata(EVENTBUS_SAGA_METADATA, target.constructor) || [];
    Reflect.defineMetadata(
      EVENTBUS_SAGA_METADATA,
      [...properties, propertyKey],
      target.constructor
    );
  };
};
