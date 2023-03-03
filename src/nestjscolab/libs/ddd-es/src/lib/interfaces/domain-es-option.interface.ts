import { ModuleMetadata, Provider, Type } from '@nestjs/common';

import { DomainEsDbModuleOptions } from '../database/domain-es-database-options';
import { IDomainEsOptionsFactory } from './domain-es-module.interface';

export type DomainEsModuleOption = DomainEsDbModuleOptions;

export interface DddEsModuleOptionAsync
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IDomainEsOptionsFactory>;
  useClass?: Type<IDomainEsOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<DomainEsModuleOption> | DomainEsModuleOption;
  inject?: unknown[];
  extraProviders?: Provider[];
}

export interface IDddEsOptions {
  mongoUrl: string;
}
