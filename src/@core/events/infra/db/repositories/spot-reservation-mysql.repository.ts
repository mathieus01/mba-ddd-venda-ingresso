import { EntityManager } from '@mikro-orm/mysql';
import { SpotReservation } from '../../../domain/entities/spot-reservation.entity';
import { ISpotReservationRepository } from '../../../domain/repositories/spot-reservation-repository.interface';
import { EventSpotId } from '../../../domain/entities/event-spot';

export class SpotReservationMysqlRepository
  implements ISpotReservationRepository
{
  constructor(private entityManager: EntityManager) {}

  async add(entity: SpotReservation): Promise<void> {
    this.entityManager.persist(entity);
  }

  findById(spot_id: string | EventSpotId): Promise<SpotReservation | null> {
    return this.entityManager.findOne(SpotReservation, {
      spot_id: typeof spot_id === 'string' ? new EventSpotId(spot_id) : spot_id,
    });
  }

  findAll(): Promise<SpotReservation[]> {
    return this.entityManager.find(SpotReservation, {});
  }

  async delete(entity: SpotReservation): Promise<void> {
    this.entityManager.remove(entity);
  }
}
