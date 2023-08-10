import {
  PASSPORT_CODE_ERROR_INFO,
  PASSPORT_CODE_LENGTH_ERROR_INFO,
  PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportCode } from './passportCode';

describe('passportCode', () => {
  it('Допускается длина поля - 6 символов', () => {
    expect(passportCode()('123256')).toBeUndefined();
  });

  it('Не может начинаться с двух нулей', () => {
    const error = passportCode()('0012');

    expect(error?.cause.code).toBe(PASSPORT_CODE_ERROR_INFO.code);
  });

  it.each(['а12345', '1.2345', '124ас', 'абв'])(
    'Invalid for %s: Допустимые символы - цифры',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO.code);
    },
  );

  it.each(['124556', '125435', '126434', '129732'])(
    'Invalid for %s: Третья цифра в коде должна принимать значения: 0, 1, 2, 3',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_ERROR_INFO.code);
    },
  );

  it.each(['', '1', '12', '123', '1234', '12345', '1264434'])(
    'Invalid for %s: Допускается длина поля - 6 символов',
    (value) => {
      const error = passportCode()(value);

      expect(error?.cause.code).toBe(PASSPORT_CODE_LENGTH_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportCode({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
