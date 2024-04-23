import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Job } from 'bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-events';
import { Process, Processor } from '@nestjs/bull';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor(private ampqConnection: AmqpConnection) {}

  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    await this.ampqConnection.publish(
      'amq.direct',
      //events.fullcycle.com/PartnerCreated
      job.data.event_name,
      job.data,
    );
    return {};
  }
}
