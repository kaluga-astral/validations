import {
  PASSPORT_NUMBER_ERROR_INFO,
  PASSPORT_NUMBER_LENGTH_ERROR_INFO,
  PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportNumber } from './passportNumber';

describe('passportNumber', () => {
  it('Допускается длина поля - 6 символов', () => {
    expect(passportNumber()('704564')).toBeUndefined();
  });

  it.each(['а12345', '1.2345', '124ас', 'абв'])(
    'Invalid for %s: Допустимые символы - цифры',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(
        PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO.code,
      );
    },
  );

  it.each(['12345678', '1234567', '12345', '1234', '123', '12', '1'])(
    'Invalid for %s: Допускается длина поля - 6 символов',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(PASSPORT_NUMBER_LENGTH_ERROR_INFO.code);
    },
  );

  it.each(['000100', '1000000'])(
    'Invalid for %s: Должна возвращать ошибку для номера паспорта за пределами допустимого диапазона (не менее 000101 и не более 999999)',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(PASSPORT_NUMBER_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportNumber({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
