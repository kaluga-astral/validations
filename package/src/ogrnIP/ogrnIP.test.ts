import { OGRN_IP_ERROR_INFO } from './constants';
import { ogrnIP } from './ogrnIP';

describe('ogrnIP', () => {
  it.each<string>(['316682000089619'])(
    'Не возвращает ошибку для "%s"',
    (value) => {
      expect(ogrnIP()(value)).toBeUndefined();
    },
  );

  it('Возвращает ошибку, если ОГРН ИП состоит целиком из нулей', () => {
    const error = ogrnIP()('000000000000000');

    expect(error?.cause.code).toBe(OGRN_IP_ERROR_INFO.code);
  });

  it.each<string>([
    'a',
    '1175958000004',
    '1175958036814',
    '1-22-33-44-5555555-6',
  ])('Возвращает ошибку для "%s"', (value) => {
    const error = ogrnIP()(value);

    expect(error?.cause.code).toBe(OGRN_IP_ERROR_INFO.code);
  });

  it('Позволяет указать кастомный message ошибки', () => {
    const customMessage = 'CustomMessage';

    const error = ogrnIP({ message: customMessage })('q');

    expect(error?.message).toBe(customMessage);
  });

  it('Не валидирует value, соответствующие условию в exclude', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(ogrnIP({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
