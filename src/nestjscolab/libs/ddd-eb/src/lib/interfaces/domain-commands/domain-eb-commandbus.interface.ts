import { IDomainEbCommand } from './domain-eb-command.interface';

export interface IDomainEbCommandBus<
  TCommandBase extends IDomainEbCommand = IDomainEbCommand,
  TResult = any
> {
  execute(command: TCommandBase): Promise<TResult>;
}
