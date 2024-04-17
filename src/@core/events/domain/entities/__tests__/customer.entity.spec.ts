import { Customer, CustomerId } from '../customer.entity';

test('Deve criar um cliente', () => {
  const customer = Customer.create({
    name: 'Joao',
    cpf: '99346413050',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.name).toBe('Joao');
  expect(customer.cpf.value).toBe('99346413050');
});
