import {
  PASSPORT_SERIES_ERROR_INFO,
  PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportSeries } from './passportSeries';

describe('passportSeries', () => {
  it('Длина поля должна быть равной 4', () => {
    expect(passportSeries()('9217')).toBeUndefined();
  });

  it('Value, начинающееся с двух нулей невалидно', () => {
    const error = passportSeries()('0012');

    expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
  });

  it.each(['а92175', '92.17', '921ас', 'абв'])(
    'Value "%s" невалидно потому, что содержит символы, отличные от цифр',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(
        PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO.code,
      );
    },
  );

  it.each(['', '9', '92', '921', '92176'])(
    'Value "%s" невалидно потому, что длина поля не равна 4 символам',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
    },
  );

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportSeries({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
