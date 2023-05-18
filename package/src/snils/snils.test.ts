import { SNILS_ERROR_INFO } from './constants';
import { snils } from './snils';

describe('snils', () => {
  it.each<string>(['15657325992', '95145370513'])('Valid for: %s', (value) => {
    expect(snils()(value)).toBeUndefined();
  });

  it('Возвращает ошибку, если СНИЛС состоит целиком из нулей', () => {
    const error = snils()('00000000000');

    expect(error?.cause.code).toBe(SNILS_ERROR_INFO.code);
  });

  it.each<string>(['a', '95145370511', '156-573-259 92'])(
    'Invalid for: %s',
    (value) => {
      const error = snils()(value);

      expect(error?.cause.code).toBe(SNILS_ERROR_INFO.code);
    },
  );

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = snils({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(snils({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
