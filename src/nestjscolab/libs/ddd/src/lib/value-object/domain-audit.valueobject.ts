import { DomainException } from '../exceptions';
import { DomainGuard } from '../utils';
import { DomainValueObject } from './domain-valueobject';

export interface IDomainAuditProps {
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export class DomainAuditValueObject extends DomainValueObject<IDomainAuditProps> {
  protected getCreatedBy() {
    return this.props.createdBy;
  }

  protected getCreatedAt() {
    return this.props.createdAt;
  }

  protected getUpdatedBy() {
    return this.props.updatedBy;
  }

  protected getUpdatedAt() {
    return this.props.updatedAt;
  }

  static create(createdBy: string, createdAt: Date = new Date()) {
    return new DomainAuditValueObject({
      createdBy,
      createdAt,
    });
  }

  static load(plainProps: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
  }): DomainAuditValueObject {
    const audit = DomainAuditValueObject.create(plainProps.createdBy);
    audit.props.createdAt = plainProps.createdAt;
    audit.props.updatedBy = plainProps.updatedBy;
    audit.props.updatedAt = plainProps.updatedAt;
    return audit;
  }

  update(updatedBy: string, updatedAt: Date = new Date()) {
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = updatedAt;
  }

  protected validate(props: IDomainAuditProps): void {
    if (
      !DomainGuard.isString(props.createdBy) ||
      DomainGuard.isEmpty(props.createdBy)
    )
      throw new DomainException('CreatedBy should be a string');
  }
}
