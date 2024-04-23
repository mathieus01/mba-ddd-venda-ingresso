import { ApplicationService } from '../../common/application/application.service';
import { Partner } from '../domain/entities/partner.entity';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';

export class PartnerService {
  constructor(
    private partnerRepository: IPartnerRepository,
    private applicationService: ApplicationService,
  ) {}

  list() {
    return this.partnerRepository.findAll();
  }

  async create(dto: { name: string }) {
    return await this.applicationService.run(async () => {
      const partner = Partner.create(dto);
      await this.partnerRepository.add(partner);
      return partner;
    });
  }

  async update(id: string, dto: { name?: string }) {
    return await this.applicationService.run(async () => {
      const partner = await this.partnerRepository.findById(id);

      if (!partner) {
        throw new Error('Partner not found');
      }

      dto.name && partner.changeName(dto.name);
      await this.partnerRepository.add(partner);
      return partner;
    });
  }
}
