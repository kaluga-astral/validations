import {
  PASSPORT_NUMBER_ERROR_INFO,
  PASSPORT_NUMBER_LENGTH_ERROR_INFO,
  PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportNumber } from './passportNumber';

describe('passportNumber', () => {
  it('Не возвращает ошибку для значений длиной 6 символов', () => {
    expect(passportNumber()('704564')).toBeUndefined();
  });

  it.each(['а12345', '1.2345', '124ас', 'абв'])(
    'Возвращает ошибку для "%" потому, что содержит цифры',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(
        PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO.code,
      );
    },
  );

  it.each(['12345678', '1234567', '12345', '1234', '123', '12', '1'])(
    'Возвращает ошибку для "%s" потому, что длина отличается от 6',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(PASSPORT_NUMBER_LENGTH_ERROR_INFO.code);
    },
  );

  it.each(['000100', '1000000'])(
    'Возвращает ошибку, если номер паспорта находится за пределами допустимого диапазона (не менее 000101 и не более 999999)',
    (value) => {
      const error = passportNumber()(value);

      expect(error?.cause.code).toBe(PASSPORT_NUMBER_ERROR_INFO.code);
    },
  );

  it('Позволяет переопределить дефолтное сообщение об ошибке', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportNumber({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
