import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each<string>([
    'Иванов',
    'иванов',
    'Иванов-Иванов',
    'Иванов Иванов',
    'Иванов.Иванов',
    'Д’‎Анжело',
    'Иванов,Иванов',
    '(Иванов)',
  ])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each([
    '',
    'Иванов@Иванов',
    'Иванов@',
    '123Иванов',
    'Иванов123',
    '123Иванов123',
    'Иванов   Иванов',
    'Иванов--Иванов',
  ])('Invalid for: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
