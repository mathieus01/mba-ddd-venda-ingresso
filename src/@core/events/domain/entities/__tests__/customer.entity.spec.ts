import { Customer } from '../customer.entity';

test('Deve criar um cliente', () => {
  const customer = Customer.create({
    name: 'Joao',
    cpf: '99346413050',
  });

  expect(customer.name).toBe('Joao');
  expect(customer.cpf.value).toBe('99346413050');
});
