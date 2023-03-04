import {
  DomainAggregateRoot,
  DomainAuditValueObject,
  DomainException,
  DomainUuidValueObject,
} from '@nestjscolab/ddd';

import { PersonName } from './person-name';
import { PersonCreatedDomainEvent } from './domainevents';
import { PersonAddress } from './person-address';
import { PersonDeletedDomainEvent } from './domainevents/person-deleted.domainevents';

interface IPersonProps {
  name: PersonName;
  addresses: PersonAddress[];
}

export enum ePersonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Person extends DomainAggregateRoot<IPersonProps> {
  status: ePersonStatus;

  private constructor(props: IPersonProps) {
    super({
      id: DomainUuidValueObject.generate(),
      props,
      audit: DomainAuditValueObject.create('foo'),
    });

    if (this.getPropsTracking().isNew) {
      const { name } = this.getPropsCopy();
      this.status = ePersonStatus.ACTIVE;

      this.addEvent(new PersonCreatedDomainEvent(this.getId(), name.unpack()));
    }
  }

  businessRules(): void {
    if (!this.getPropsCopy().addresses)
      throw new DomainException(
        'A new Person NEEDS TO HAVE a valid address as a minimum to be registered'
      );
  }

  public static create(name: PersonName, addresses: PersonAddress[]): Person {
    return new Person({ name, addresses });
  }

  public delete() {
    if (this.status === ePersonStatus.ACTIVE)
      throw new DomainException('An Active Person cannot be removed');

    this.status = ePersonStatus.INACTIVE;

    this.addEvent(
      new PersonDeletedDomainEvent(
        this.getId(),
        this.getPropsCopy().name.unpack()
      )
    );
  }

  public addAddress(address: PersonAddress) {
    this.existsAddress(address);

    this.getProps().addresses.push(address);
  }

  public removeAddress(address: PersonAddress) {
    this.existsAddress(address, true);

    const index = this.getPropsCopy().addresses.indexOf(address);

    this.getProps().addresses.splice(index, 1);
  }

  private existsAddress(address: PersonAddress, remove = false) {
    const { addresses } = this.getPropsCopy();

    const exists = addresses.includes(address);

    if (remove) {
      if (!exists)
        throw new DomainException(`Address ${address} does not exists.`);
    } else {
      if (exists)
        throw new DomainException(`Address ${address} already exists.`);
    }
  }
}
