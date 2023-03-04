import { IDomainEbCommand } from './domain-eb-command.interface';

export interface IDomainEbCommandPublisher<
  TCommandBase extends IDomainEbCommand = IDomainEbCommand
> {
  publish(command: TCommandBase): any;
}
