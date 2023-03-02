import { DomainInvalidArgumentException } from '../exceptions';
import { DomainGuard, convertPropsToObject } from '../utils';

export type DomainPrimitiveType = string | number | boolean;

export interface IDomainPrimitive<T extends DomainPrimitiveType | Date> {
  value: T;
}

type DomainValueObjectProps<TDomainPrimitive> = TDomainPrimitive extends
  | DomainPrimitiveType
  | Date
  ? IDomainPrimitive<TDomainPrimitive>
  : TDomainPrimitive;

export abstract class DomainValueObject<T> {
  protected readonly props: DomainValueObjectProps<T>;

  constructor(props: DomainValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: DomainValueObjectProps<T>): void;

  public equals(object?: DomainValueObject<T>): boolean {
    if (object === null || object === undefined) return false;

    return JSON.stringify(this) === JSON.stringify(object);
  }

  private checkIfEmpty(props: DomainValueObjectProps<T>): void {
    if (
      DomainGuard.isEmpty(props) ||
      (this.isDomainPrimitive(props) && DomainGuard.isEmpty(props.value))
    ) {
      throw new DomainInvalidArgumentException('Property cannot be empty');
    }
  }

  private isDomainPrimitive(
    obj: unknown
  ): obj is IDomainPrimitive<T & (DomainPrimitiveType | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, 'value')) {
      return true;
    }

    return false;
  }

  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value;
    }

    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }
}
