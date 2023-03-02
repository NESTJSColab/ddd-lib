import {
  DomainAggregateRoot,
  DomainAuditValueObject,
  DomainUuidValueObject,
} from '@nestjscolab/ddd';

import { PersonName } from './person-name';
import { PersonCreatedDomainEvent } from './domainevents';

interface IPersonProps {
  name: PersonName;
}

export enum ePersonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Person extends DomainAggregateRoot<IPersonProps> {
  private constructor(props: IPersonProps) {
    super({
      id: DomainUuidValueObject.generate(),
      props,
      audit: DomainAuditValueObject.create('foo'),
    });

    if (this.getPropsTracking().isNew) {
      const { name } = this.getPropsCopy();

      this.addEvent(new PersonCreatedDomainEvent(this.getId(), name.unpack()));
    }
  }

  businessRules(): void {
    //
  }

  public static create(name: PersonName): Person {
    return new Person({ name });
  }
}
