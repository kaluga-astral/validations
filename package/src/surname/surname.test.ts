import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

// Valid
describe('surname', () => {
  it.each<string>(['Иванов', 'иванов', 'И'])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each<string>([
    'Иванов-Иванов',
    'Иванов Иванов',
    'Иванов.Иванов',
    'Иванов,Иванов',
    '(Иванов)',
  ])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each<string>(['Генрих-V', 'Генрих-I', 'Д’‎Анжело'])(
    'Valid for: %s',
    (value) => {
      expect(surname()(value)).toBeUndefined();
    },
  );

  // Invalid
  it.each([Array(201).fill('а').join(''), ''])('Invalid for: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it.each(['Иванов   Иванов', 'Иванов--Иванов', 'Иванов@Иванов'])(
    'Invalid for: %s',
    (value) => {
      const error = surname()(value);

      expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
    },
  );

  it.each(['123Иванов', 'Иванов123', '123Иванов123'])(
    'Invalid for: %s',
    (value) => {
      const error = surname()(value);

      expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
    },
  );

  it.each(['Генрих-v', 'Генрих-i', 'Ivanov'])('Invalid for: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
