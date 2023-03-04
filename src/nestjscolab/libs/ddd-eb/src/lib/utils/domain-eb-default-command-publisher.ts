import { Subject } from 'rxjs';
import { IDomainEbCommand, IDomainEbCommandPublisher } from '../interfaces';

export class DomainEbDefaultCommandPublisher<
  TDomainEbCommand extends IDomainEbCommand
> implements IDomainEbCommandPublisher<TDomainEbCommand>
{
  constructor(private subject$: Subject<TDomainEbCommand>) {}

  publish<T extends TDomainEbCommand>(command: T) {
    this.subject$.next(command);
  }
}
