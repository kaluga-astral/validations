import {
  PASSPORT_CODE_ERROR_INFO,
  PASSPORT_CODE_LENGTH_ERROR_INFO,
  PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportCode } from './passportCode';

describe('passportCode', () => {
  it('Считает строку валидной, если длина поля отлична от 6', () => {
    expect(passportCode()('123256')).toBeUndefined();
  });

  it('Возвращает ошибку, если значение начинается с двух нулей', () => {
    const error = passportCode()('0012');

    expect(error?.cause.code).toBe(PASSPORT_CODE_ERROR_INFO.code);
  });

  it.each(['а12345', '1.2345', '124ас', 'абв'])(
    'Возвращает ошибку для value "%s" потому, что содержат символы, отличные от цифр',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO.code);
    },
  );

  it.each(['124556', '125435', '126434', '129732'])(
    'Возвращает ошибку для "%s" потому, что третья цифра кода отлична от: 0, 1, 2, 3',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_ERROR_INFO.code);
    },
  );

  it.each(['', '1', '12', '123', '1234', '12345', '1264434'])(
    'Возвращает ошибку для "%s" потому, что длина поля отличается от 6',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_LENGTH_ERROR_INFO.code);
    },
  );

  it('Позволяет указать кастомный message ошибки', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportCode({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
