import { PATRONYMIC_ERROR_INFO } from './constants';
import { patronymic } from './patronymic';

describe('patronymic', () => {
  it.each<string>([
    'Иванович',
    'иванович',
    'Иванович-Иванович',
    'Иванович Иванович',
    'Иванович.Иванович',
    'Д’‎Анжело',
    'Иванович,Иванович',
    '(Иванович)',
  ])('Valid for: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
  });

  it.each<string>([
    '',
    'Иванович@Иванович',
    '123Иванович',
    'Иванович123',
    '123Иванович123',
    'Иванович@',
    'Иванович  Иванович',
    'Иванович--Иванович',
  ])('Invalid for: %s', (value) => {
    const error = patronymic()(value);

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = patronymic({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
