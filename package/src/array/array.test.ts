import { createErrorCode } from '../core';

import { array } from './array';
import { ARRAY_TYPE_ERROR_INFO } from './constants';

describe('array', () => {
  it.each<unknown>([
    22,
    'string',
    createErrorCode('error'),
    { value: 22 },
    new Set([1]),
  ])('Возвращает ошибку, если value не массив: %s', (value) => {
    const error = array()(value);

    expect(error?.cause.code).toBe(ARRAY_TYPE_ERROR_INFO.code);
  });

  it.each<Array<unknown>>([Array([1, 2]), Array([])])(
    'Не возвращает ошибку, если value является массивом: %j',
    (value) => {
      const result = array()(value);

      expect(result).toBeUndefined();
    },
  );
});
