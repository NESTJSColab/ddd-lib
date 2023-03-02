import { Module } from '@nestjs/common';

@Module({})
export class DddEsModule {
  static forRoot(options: DddEsModuleOption): DynamicModule {
    return {
      module: DddEsModule,
      imports: [
        DatabaseModule.forRoot({
          uri: options.uri,
        }),
        MongooseModule.forFeature([
          { name: EventRecordStore.name, schema: EventRecordStoreSchema },
        ]),
      ],
      providers: [DddEs, DddEsRepository],
      exports: [DddEs],
    };
  }
}
