import { DomainEntity } from '../domain-entity';
import { DomainGuard } from './domain-guard.helper';

function isEntity(obj: unknown): obj is DomainEntity<unknown> {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'toObject') &&
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    Object.prototype.hasOwnProperty.call(obj, '_id') &&
    Object.prototype.hasOwnProperty.call(obj, '_trackingProps')
  );
}

function convertToPlainObject(item: any): any {
  if (DomainGuard.isValueObject(item)) {
    return item.unpack();
  }
  if (isEntity(item)) {
    return item.toObject();
  }
  return item;
}

export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props };

  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
        return convertToPlainObject(item);
      });
    }
    propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
  }

  return propsCopy;
}
