import { DomainEsRecord } from '../database/collections/domain-es-record.collection';

export interface IDomainEsRecordRepository {
  getEvents<TRecord extends DomainEsRecord>(
    aggregateId: string,
    aggregateName: string
  ): Promise<TRecord>;

  getEvent<TRecord extends DomainEsRecord>(index: number): Promise<TRecord>;

  save<TRecord extends DomainEsRecord>(record: TRecord): Promise<void>;
}
