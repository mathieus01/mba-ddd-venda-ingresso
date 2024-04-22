import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { EventSectionId } from '../domain/entities/event-section';
import { EventSpotId } from '../domain/entities/event-spot';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';

export class EventService {
  constructor(
    private eventRepository: IEventRepository,
    private partnerRepository: IPartnerRepository,
    private ouw: IUnitOfWork,
  ) {}

  findEvents() {
    return this.eventRepository.findAll();
  }

  async findSections(event_id: string) {
    const event = await this.eventRepository.findById(event_id);
    return event.sections;
  }

  async create(dto: {
    name: string;
    description?: string;
    date: Date;
    partner_id: string;
  }) {
    const partner = await this.partnerRepository.findById(dto.partner_id);

    if (!partner) {
      throw new Error('Partner not found!');
    }

    const event = partner.initEvent({
      name: dto.name,
      date: dto.date,
      description: dto.description,
    });

    this.eventRepository.add(event);
    await this.ouw.commit();
    return event;
  }

  async update(
    id: string,
    input: { name?: string; description?: string; date?: Date },
  ) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    input.name && event.changeName(input.name);
    input.description && event.changeDescription(input.description);
    input.date && event.changeDate(input.date);

    this.eventRepository.add(event);
    await this.ouw.commit();
    return event;
  }

  async addSection(input: {
    name: string;
    description?: string | null;
    total_spots: number;
    price: number;
    event_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    event.addSection(input);

    await this.eventRepository.add(event);
    await this.ouw.commit();
    return event;
  }

  async updateSection(input: {
    name: string;
    description?: string | null;
    event_id: string;
    section_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const sectionId = new EventSectionId(input.section_id);

    event.changeSectionInformation({
      section_id: sectionId,
      name: input.name,
      description: input.description,
    });

    await this.eventRepository.add(event);
    await this.ouw.commit();
    return event.sections;
  }

  async findSpots(input: { event_id: string; section_id: string }) {
    const event = await this.eventRepository.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const section = event.findSection(input.section_id);

    return section.spots;
  }

  async updateLocation(input: {
    location: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);

    event.changeLocation({
      section_id: sectionId,
      spot_id: spotId,
      location: input.location,
    });

    await this.eventRepository.add(event);
    const section = event.findSection(input.section_id);

    await this.ouw.commit();

    return section.findSpot(spotId);
  }

  async publishAll(input: { event_id: string }) {
    const event = await this.eventRepository.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    event.publishAll();

    await this.eventRepository.add(event);
    await this.ouw.commit();

    return event;
  }
}
