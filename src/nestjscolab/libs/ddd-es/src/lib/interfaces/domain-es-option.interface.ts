/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ModuleMetadata, Provider, Type } from '@nestjs/common'

import { DbModuleOptions } from '../database/module-options'
import { IDddEsOptionsFactory } from './idddes-module.interface'

export interface DddEsModuleOption extends DbModuleOptions {}

export interface DddEsModuleOptionAsync
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IDddEsOptionsFactory>
  useClass?: Type<IDddEsOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<DddEsModuleOption> | DddEsModuleOption
  inject?: any[]
  extraProviders?: Provider[]
}

export interface IDddEsOptions {
  mongoUrl: string
}
