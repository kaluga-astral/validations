import { BOOLEAN_TYPE_ERROR_INFO } from './constants';
import { boolean } from './boolean';

describe('boolean', () => {
  it.each<unknown>(['string', new Date(), {}, Symbol(), 22])(
    'Value "%s" невалидно',
    (value) => {
      const error = boolean()(value);

      expect(error?.cause.code).toBe(BOOLEAN_TYPE_ERROR_INFO.code);
    },
  );

  it('Для value=true ошибка не возвращается', () => {
    const result = boolean()(true);

    expect(result).toBeUndefined();
  });
});
