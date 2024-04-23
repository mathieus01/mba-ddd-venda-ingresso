import { Partner } from '../partner.entity';
import { initOrm } from './helpers';

describe('Partner tests', () => {
  initOrm();
  test('deve criar um evento', () => {
    const partner = Partner.create({
      name: 'Parceiro 1',
    });

    const event = partner.initEvent({
      name: 'Evento 1',
      description: 'Descrição do evento 1',
      date: new Date(),
    });

    partner.changeName('Parceiro 1 alterado');

    console.log(event);
    console.log(partner);

    expect(event).toBeDefined();
    expect(partner).toBeDefined();
  });
});
