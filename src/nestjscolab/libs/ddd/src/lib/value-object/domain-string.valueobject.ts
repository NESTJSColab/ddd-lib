import { DomainInvalidArgumentException } from '../exceptions';
import { DomainGuard } from '../utils';
import { DomainValueObject, IDomainPrimitive } from './domain-valueobject';

export class DomainStringValueObject extends DomainValueObject<string> {
  protected validate(props: IDomainPrimitive<string>): void {
    if (!DomainGuard.isString(props.value)) {
      throw new DomainInvalidArgumentException('Value must be a string');
    }
  }

  protected constructor(value: string) {
    super({ value });
  }

  static create(value: string) {
    return new DomainStringValueObject(value);
  }
}
