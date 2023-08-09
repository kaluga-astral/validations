import {
  PASSPORT_SERIES_ERROR_INFO,
  PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportSeries } from './passportSeries';

describe('passportSeries', () => {
  it('Допускается длина поля - 4 символа', () => {
    expect(passportSeries()('9217')).toBeUndefined();
  });

  it('Не может начинаться с двух нулей', () => {
    const error = passportSeries()('0012');

    expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
  });

  it.each(['а92175', '92.17', '921ас', 'абв'])(
    'Invalid for %s: Допустимые символы - цифры',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(
        PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO.code,
      );
    },
  );

  it.each(['', '9', '92', '921', '92176'])(
    'Invalid for %s: Допускается длина поля - 4 символа',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportSeries({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
