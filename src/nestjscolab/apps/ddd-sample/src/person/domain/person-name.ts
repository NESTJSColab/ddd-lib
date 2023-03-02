import {
  DomainException,
  DomainGuard,
  DomainStringValueObject,
  IDomainPrimitive,
} from '@nestjscolab/ddd';

export class PersonName extends DomainStringValueObject {
  protected validate(props: IDomainPrimitive<string>): void {
    if (!DomainGuard.lengthIsBetween(props.value, 5, 300))
      throw new DomainException(`Length of Name ${name} is not valid`);
  }
}
