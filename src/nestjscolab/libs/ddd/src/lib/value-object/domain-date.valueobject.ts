import { DomainInvalidArgumentException } from '../exceptions';
import { DomainGuard } from '../utils';
import { DomainValueObject, IDomainPrimitive } from './domain-valueobject';

export class DomainDateValueObject extends DomainValueObject<Date> {
  protected validate(props: IDomainPrimitive<Date>): void {
    if (!DomainGuard.isDate(props.value))
      throw new DomainInvalidArgumentException('Value must be a date');
  }
}
