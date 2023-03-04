import { IDomainEbCommand } from './domain-eb-command.interface';

export interface IDomainEbCommandHandler<
  TCommand extends IDomainEbCommand = any
> {
  execute(command: TCommand): Promise<void>;
}
