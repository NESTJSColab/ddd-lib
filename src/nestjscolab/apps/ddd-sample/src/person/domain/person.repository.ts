import { IDomainReadRepository } from '@nestjscolab/ddd';

export class PersonTable {}

export interface IPersonRepository
  extends IDomainReadRepository<string, PersonTable> {}
