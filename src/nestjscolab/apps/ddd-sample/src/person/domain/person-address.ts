import { DomainGuard, DomainValueObject } from '@nestjscolab/ddd';
import { DomainException } from '../../../../../libs/ddd/src/lib/exceptions/domain-core.exception';

interface IPersonAddressProps {
  country: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
}

export class PersonAddress extends DomainValueObject<IPersonAddressProps> {
  private constructor(props: IPersonAddressProps) {
    super({ ...props });
  }

  protected validate(props: IPersonAddressProps): void {
    if (
      !DomainGuard.isString(props.country) ||
      DomainGuard.lengthIsBetween(props.country, 1, 3)
    )
      throw new DomainException('Country is not valid');
  }

  static create(props: IPersonAddressProps) {
    return new PersonAddress(props);
  }
}
