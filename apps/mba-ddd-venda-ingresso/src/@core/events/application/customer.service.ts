import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';

export class CustomerService {
  constructor(
    private customerRepository: ICustomerRepository,
    private ouw: IUnitOfWork,
  ) {}

  list() {
    return this.customerRepository.findAll();
  }

  //dto ou input
  async register(dto: { name: string; cpf: string }) {
    const customer = Customer.create(dto);
    this.customerRepository.add(customer);
    await this.ouw.commit();
    return customer;
  }

  async update(id: string, input: { name?: string }) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    input.name && customer.changeName(input.name);

    this.customerRepository.add(customer);
    await this.ouw.commit();
    return customer;
  }
}
