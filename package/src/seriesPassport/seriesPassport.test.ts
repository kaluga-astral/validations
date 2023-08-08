import { SERIES_PASSPORT_ERROR_INFO } from './constants';
import { seriesPassport } from './seriesPassport';

describe('seriesPassport', () => {
  it('Допускается длина поля - 4 цифры. Маска серии ХХ ХХ', () => {
    expect(seriesPassport()('92 17')).toBeUndefined();
  });

  it('Не может начинаться с двух нулей', () => {
    const error = seriesPassport()('00 12');

    expect(error?.cause.code).toBe(SERIES_PASSPORT_ERROR_INFO.code);
  });

  it.each([
    '9 15',
    '50-19',
    '4-5',
    '2-',
    '12/23',
    '7821',
    '45 2',
    '32',
    '56 ',
    '4',
    '8-5',
    '34-5',
    '434-3',
    '5443-3',
    '543-34324',
    '2352345',
    '5332',
    '',
  ])(
    'Invalid for %s: Допускается длина поля - 4 цифры. Маска серии ХХ ХХ',
    (value) => {
      const error = seriesPassport()(value);

      expect(error?.cause.code).toBe(SERIES_PASSPORT_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = seriesPassport({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
