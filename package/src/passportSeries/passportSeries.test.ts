import {
  PASSPORT_SERIES_ERROR_INFO,
  PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO,
} from './constants';
import { passportSeries } from './passportSeries';

describe('passportSeries', () => {
  it('Не возвращает ошибку для значений длиной 4 символа', () => {
    expect(passportSeries()('9217')).toBeUndefined();
  });

  it('Возвращает ошибку для значений, начинающихся на два ноля', () => {
    const error = passportSeries()('0012');

    expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
  });

  it.each(['а92175', '92.17', '921ас', 'абв'])(
    'Возвращает ошибку для "%s" потому, что содержит цифры',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(
        PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO.code,
      );
    },
  );

  it.each(['', '9', '92', '921', '92176'])(
    'Возвращает ошибку для "%s" потому, что длина отличается от 4',
    (value) => {
      const error = passportSeries()(value);

      expect(error?.cause.code).toBe(PASSPORT_SERIES_ERROR_INFO.code);
    },
  );

  it('Позволяет переопределить дефолтное сообщение об ошибке', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = passportSeries({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
