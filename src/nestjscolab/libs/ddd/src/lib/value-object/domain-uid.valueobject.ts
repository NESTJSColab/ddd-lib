import { v4 as uuidv4 } from 'uuid';

import { DomainGuard } from '../utils';
import { DomainValueObject, IDomainPrimitive } from './domain-valueobject';
import { DomainException } from '../exceptions';

export class DomainUuidValueObject extends DomainValueObject<string> {
  protected validate(props: IDomainPrimitive<string>): void {
    if (!DomainGuard.lenghtIsEqual(props.value, 36))
      throw new DomainException('Invalid lenght Guid');
  }

  public static generate(): DomainUuidValueObject {
    try {
      const id = uuidv4();

      return new DomainUuidValueObject({ value: id });
    } catch (error) {
      throw new DomainException(error.message);
    }
  }

  public static setId(id: string) {
    return new DomainUuidValueObject({ value: id });
  }
}
