export class DomainEsRecordRepository implements IDomainEsRecordRepository {
  getEvents<TRecord extends RecordStoreEvent>(
    aggregateId: string,
    aggregateName: string
  ): Promise<TRecord> {
    throw new Error('Method not implemented.');
  }
  getEvent<TRecord extends RecordStoreEvent>(index: number): Promise<TRecord> {
    throw new Error('Method not implemented.');
  }
  save<TRecord extends RecordStoreEvent>(record: TRecord): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
