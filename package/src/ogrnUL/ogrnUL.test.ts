import { OGRN_UL_ERROR_INFO } from './constants';
import { ogrnUL } from './ogrnUL';

describe('ogrnUL', () => {
  it.each<string>(['8104338364837', '1214000000092'])(
    'Valid for: %s',
    (value) => {
      expect(ogrnUL()(value)).toBeUndefined();
    },
  );

  it('Возвращает ошибку, если ОГРН ЮЛ состоит целиком из нулей', () => {
    const error = ogrnUL()('00000000000');

    expect(error?.cause.code).toBe(OGRN_UL_ERROR_INFO.code);
  });

  it.each<string>(['a', '1175958000004', '1-22-33-5555555-6'])(
    'Invalid for: %s',
    (value) => {
      const error = ogrnUL()(value);

      expect(error?.cause.code).toBe(OGRN_UL_ERROR_INFO.code);
    },
  );

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = ogrnUL({ message: customMessage })('q');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(ogrnUL({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
