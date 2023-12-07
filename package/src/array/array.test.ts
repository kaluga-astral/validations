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
  ])('Value "%j", не являющиеся массивом считается невалидным', (value) => {
    const error = array()(value);

    expect(error?.cause.code).toBe(ARRAY_TYPE_ERROR_INFO.code);
  });

  it.each<Array<unknown>>([Array([1, 2]), Array([])])(
    'Value "%j", являющиеся массивом считается валидным',
    (value) => {
      const result = array()(value);

      expect(result).toBeUndefined();
    },
  );
});
