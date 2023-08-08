import { NUMBER_PASSPORT_ERROR_INFO } from './constants';
import { numberPassport } from './numberPassport';

describe('numberPassport', () => {
  it('Допускается длина поля - 6 цифр', () => {
    expect(numberPassport()('704564')).toBeUndefined();
  });

  it.each(['000100', '1000000'])(
    'Invalid for %s: Должна возвращать ошибку для номера паспорта за пределами допустимого диапазона (не менее 000101 и не более 999999)',
    (value) => {
      const error = numberPassport()(value);

      expect(error?.cause.code).toBe(NUMBER_PASSPORT_ERROR_INFO.code);
    },
  );

  it.each(['12345678', '1234567', '12345', '1234', '123', '12', '1'])(
    'Invalid for %s: Допускается длина поля - 6 цифр',
    (value) => {
      const error = numberPassport()(value);

      expect(error?.cause.code).toBe(NUMBER_PASSPORT_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = numberPassport({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
