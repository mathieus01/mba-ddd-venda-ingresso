import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { Partner } from '../domain/entities/partner.entity';
import { IUnitOfWork } from '../../common/application/unit-of-work.interface';

export class PartnerService {
  constructor(
    private partnerRepository: IPartnerRepository,
    private uow: IUnitOfWork,
  ) {}

  list() {
    return this.partnerRepository.findAll();
  }

  async create(dto: { name: string }) {
    const partner = Partner.create(dto);
    await this.partnerRepository.add(partner);
    await this.uow.commit();
    return partner;
  }

  async update(id: string, dto: { name?: string }) {
    const partner = await this.partnerRepository.findById(id);

    if (!partner) {
      throw new Error('Partner not found');
    }

    dto.name && partner.changeName(dto.name);
    this.partnerRepository.add(partner);
    this.uow.commit();
    return partner;
  }
}
