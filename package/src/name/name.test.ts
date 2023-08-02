import { NAME_ERROR_INFO } from './constants';
import { name } from './name';

// Valid
describe('name', () => {
  it.each(['Иван', 'иван', 'И'])('Valid for: %s', (value) => {
    expect(name()(value)).toBeUndefined();
  });

  it.each(['Иван-Иван', 'Иван Иван', 'Иван.Иван', 'Иван,Иван', '(Иван)'])(
    'Valid for: %s',
    (value) => {
      expect(name()(value)).toBeUndefined();
    },
  );

  it.each(['Генрих-V', 'Генрих-I', 'Д’‎Анжело'])('Valid for: %s', (value) => {
    expect(name()(value)).toBeUndefined();
  });

  // Invalid
  it.each([Array(201).fill('а').join(''), ''])('Invalid for: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it.each(['Иван  Иван', 'Иван--Иван', 'Иван@Иван'])(
    'Invalid for: %s',
    (value) => {
      const error = name()(value);

      expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
    },
  );

  it.each(['123Иван', 'Иван123', '123Иван123'])('Invalid for: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it.each(['Генрих-v', 'Генрих-i', 'Ivan'])('Invalid for: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = name({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
