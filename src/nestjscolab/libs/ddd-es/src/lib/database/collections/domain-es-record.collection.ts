import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DomainEsRecordStoreDocument = HydratedDocument<DomainEsRecord>;

@Schema()
export class DomainEsRecord {
  @Prop()
  aggregateId: string;

  @Prop()
  version: number;

  @Prop()
  eventId: string;

  @Prop()
  eventType: string;

  @Prop()
  eventName: string;

  @Prop()
  eventData: string;

  @Prop()
  ocurredOn: string;
}

export const DomainEsRecordStoreSchema =
  SchemaFactory.createForClass(DomainEsRecord);
