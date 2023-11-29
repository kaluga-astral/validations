import { BOOLEAN_TYPE_ERROR_INFO } from './constants';
import { boolean } from './boolean';

describe('boolean', () => {
  it.each<unknown>(['string', new Date(), {}, Symbol(), 22])(
    'Возвращает ошибку для "%s"',
    (value) => {
      const error = boolean()(value);

      expect(error?.cause.code).toBe(BOOLEAN_TYPE_ERROR_INFO.code);
    },
  );

  it('Не возвращает ошибку для true', () => {
    const result = boolean()(true);

    expect(result).toBeUndefined();
  });
});
