import { PATRONYMIC_ERROR_INFO } from './constants';
import { patronymic } from './patronymic';

// Valid
describe('patronymic', () => {
  it.each<string>(['Иванович', 'иванович', 'И'])('Valid for: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
  });

  it.each<string>([
    'Иванович-Иванович',
    'Иванович Иванович',
    'Иванович.Иванович',
    'Иванович,Иванович',
    '(Иванович)',
  ])('Valid for: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
  });

  it.each<string>(['Генрих-V', 'Генрих-I', 'Д’‎Анжело'])(
    'Valid for: %s',
    (value) => {
      expect(patronymic()(value)).toBeUndefined();
    },
  );

  // Invalid
  it.each<string>([Array(201).fill('а').join(''), ''])(
    'Invalid for: %s',
    (value) => {
      const error = patronymic()(value);

      expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
    },
  );

  it.each<string>([
    'Иванович  Иванович',
    'Иванович--Иванович',
    'Иванович@Иванович',
  ])('Invalid for: %s', (value) => {
    const error = patronymic()(value);

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it.each<string>(['123Иванович', 'Иванович123', '123Иванович123'])(
    'Invalid for: %s',
    (value) => {
      const error = patronymic()(value);

      expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
    },
  );

  it.each<string>(['Генрих-v', 'Генрих-i', 'Ivanovich'])(
    'Invalid for: %s',
    (value) => {
      const error = patronymic()(value);

      expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = patronymic({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
