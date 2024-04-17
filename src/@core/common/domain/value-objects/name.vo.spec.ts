import { Name } from './name.vo';

test('deve criar um nome valido', () => {
  const name = new Name('aaaaa');
  expect(name.value).toBe('aaaaa');
});
