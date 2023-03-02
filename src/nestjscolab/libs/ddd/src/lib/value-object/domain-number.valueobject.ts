import { DomainInvalidArgumentException } from '../exceptions';
import { DomainGuard } from '../utils';
import { DomainValueObject, IDomainPrimitive } from './domain-valueobject';

export class DomainNumberValueObject extends DomainValueObject<number> {
  protected validate(props: IDomainPrimitive<number>): void {
    if (!DomainGuard.isNumber(props.value)) {
      throw new DomainInvalidArgumentException('Value must be a number');
    }
  }
}
