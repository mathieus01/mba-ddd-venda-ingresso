import { IDomainEvent } from '../../../common/domain/domain-event';
import { PartnerId } from '../entities/partner.entity';

export class PartnerChangedName implements IDomainEvent {
  readonly occurred_on: Date;
  readonly event_version: number = 1;

  constructor(
    readonly aggregate_id: PartnerId,
    readonly name: string,
  ) {
    this.occurred_on = new Date();
  }
}
