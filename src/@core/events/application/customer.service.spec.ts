import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';

test('Deve listar os customers', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const customerRepo = new CustomerMysqlRepository(em);
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = Customer.create({
    name: 'Matheus',
    cpf: '703.758.870-91',
  });

  await customerRepo.add(customer);
  await em.flush();
  await em.clear();

  const customers = await customerService.list();
  console.log(customers);

  await orm.close();
});

test('deve registrar um customer', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const customerRepo = new CustomerMysqlRepository(em);
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, unitOfWork);

  const customer = await customerService.register({
    name: 'Matheus N',
    cpf: '703.758.870-91',
  });

  await em.flush();
  await em.clear();

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.name).toEqual('Matheus N');
  expect(customer.cpf.value).toEqual('70375887091');

  em.clear();

  const customerDB = await customerRepo.findById(customer.id);

  expect(customerDB).toBeInstanceOf(Customer);
  expect(customerDB.id.value).toEqual(customer.id.value);
  expect(customerDB.name).toEqual(customer.name);
  expect(customerDB.cpf.value).toEqual(customer.cpf.value);

  await orm.close();
});
