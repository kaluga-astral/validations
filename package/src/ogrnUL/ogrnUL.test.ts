import { OGRN_UL_ERROR_INFO } from './constants';
import { ogrnUL } from './ogrnUL';

describe('ogrnUL', () => {
  it.each<string>(['8104338364837', '1214000000092'])(
    'Не возвращает ошибку для "%s"',
    (value) => {
      expect(ogrnUL()(value)).toBeUndefined();
    },
  );

  it('Возвращает ошибку, если ОГРН ЮЛ состоит целиком из нулей', () => {
    const error = ogrnUL()('00000000000');

    expect(error?.cause.code).toBe(OGRN_UL_ERROR_INFO.code);
  });

  it.each<string>(['a', '1175958000004', '1-22-33-5555555-6'])(
    'Возвращает ошибку для "%s"',
    (value) => {
      const error = ogrnUL()(value);

      expect(error?.cause.code).toBe(OGRN_UL_ERROR_INFO.code);
    },
  );

  it('Позволяет указать кастомный message ошибки', () => {
    const customMessage = 'CustomMessage';

    const error = ogrnUL({ message: customMessage })('q');

    expect(error?.message).toBe(customMessage);
  });

  it('Не валидирует value, соответствующие условию в exclude', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(ogrnUL({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
