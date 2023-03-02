import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { DomainEsDbModuleOptions } from './domain-es-database-options';
import { DomainEsRecord } from './collections/domain-es-record.collection';

@Module({})
export class DatabaseModule {
  private static getConnectionOptions(
    config: ConfigService,
    options: DomainEsDbModuleOptions
  ): MongooseModuleOptions {
    return {
      ...options,
    };
  }

  static forRoot(options: DomainEsDbModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) =>
            this.getConnectionOptions(configService, options),
          inject: [ConfigService],
        }),
      ],
      providers: [DomainEsRecord],
      exports: [DomainEsRecord],
    };
  }
}
