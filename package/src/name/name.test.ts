import { NAME_ERROR_INFO } from './constants';
import { name } from './name';

describe('name', () => {
  it.each([
    'Иван',
    'иван',
    'Иван-Иван',
    'Иван Иван',
    'Иван.Иван',
    'Д’‎Анжело',
    'Иван,Иван',
    '(Иван)',
  ])('Valid for: %s', (value) => {
    expect(name()(value)).toBeUndefined();
  });

  it.each([
    '',
    'Иван  Иван',
    'Иван--Иван',
    'Иван@Иван',
    '123Иван',
    'Иван@',
    'Иван123',
    '123Иван123',
  ])('Invalid for: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = name({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
