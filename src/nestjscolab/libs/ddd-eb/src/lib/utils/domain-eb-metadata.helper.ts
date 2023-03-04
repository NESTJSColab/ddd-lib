import { Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

import { DomainEbIntegrationEvent } from '../domain-eb-integrationevent';
import { IDomainEbIntegrationEventHandler } from '../interfaces';

export function flatMap<T>(
  modules: Module[],
  callback: (instance: InstanceWrapper) => Type<any> | undefined
): Type<T>[] {
  const items = modules
    .map((module) => [...module.providers.values()].map(callback))
    .reduce((a, b) => a.concat(b), []);
  return items.filter((element) => !!element) as Type<T>[];
}

export const filterProvider = (
  wrapper: InstanceWrapper,
  metadataKey: string
): Type<any> | undefined => {
  const { instance } = wrapper;
  if (!instance) {
    return undefined;
  }
  return extractMetadata(instance, metadataKey);
};

export const extractMetadata = (
  instance: Record<string, any>,
  metadataKey: string
): Type<any> => {
  if (!instance.constructor) {
    return;
  }
  const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
  return metadata ? (instance.constructor as Type<any>) : undefined;
};

export function getDomainEbIntegrationEventHandler<
  TEventBase extends DomainEbIntegrationEvent = DomainEbIntegrationEvent
>(
  this: any,
  event: TEventBase
): Type<IDomainEbIntegrationEventHandler<TEventBase>> | undefined {
  const handler = `on${this.getEventName(event)}`;
  return this[handler];
}

export const getDomainEbIntegrationEventName = (event: any): string => {
  const { constructor } = Object.getPrototypeOf(event);
  return constructor.name as string;
};
