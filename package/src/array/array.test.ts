import { array } from './array';
import { ARRAY_TYPE_ERROR_INFO } from './constants';

describe('array', () => {
  it.each<unknown>([22, 'string', Symbol(), { value: 22 }, new Set([1])])(
    'Ошибка, если не массив: %s',
    (value) => {
      const error = array()(value);

      expect(error?.cause.code).toBe(ARRAY_TYPE_ERROR_INFO.code);
    },
  );

  it.each<Array<unknown>>([Array([1, 2]), Array([])])(
    'Нет ошибки, если массив: %j',
    (value) => {
      console.log('value', value);

      const result = array()(value);

      expect(result).toBeUndefined();
    },
  );
});
