import { expect } from 'vitest';

import { string } from '../string';
import { array } from '../array';

import {
  ARRAY_MIN_ERROR_CODE,
  NUMBER_MIN_ERROR_CODE,
  STRING_MIN_ERROR_CODE,
} from './constants';
import { min } from './min';

describe('min', () => {
  it.each<{ value: string; threshold: number }>([
    { value: 'aaa', threshold: 1 },
    { value: 'a', threshold: 0 },
    { value: 'a', threshold: 1 },
    { value: 'a', threshold: -1 },
  ])('string:params:%j: valid', ({ value, threshold }) => {
    const validate = string(min(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: string; threshold: number }>([{ value: 'a', threshold: 2 }])(
    'string:params:%j: invalid',
    ({ value, threshold }) => {
      const validate = string(min(threshold));

      const error = validate(value);

      expect(error?.code).toBe(STRING_MIN_ERROR_CODE);
    },
  );

  it.each<{ value: number; threshold: number }>([
    { value: 3, threshold: 2 },
    { value: 0, threshold: 0 },
    { value: 0, threshold: -2 },
  ])('number:params:%j: valid', ({ value, threshold }) => {
    const validate = min(threshold);

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: number; threshold: number }>([
    { value: -1, threshold: 0 },
    { value: 2, threshold: 3 },
  ])('number:params:%j: invalid', ({ value, threshold }) => {
    const validate = min(threshold);

    const error = validate(value);

    expect(error?.code).toBe(NUMBER_MIN_ERROR_CODE);
  });

  it('params.getMessage: позволяет переопределить message', () => {
    const validate = min(0, { getMessage: () => 'my message' });

    const error = validate(-1);

    expect(error?.message).toBe('my message');
  });

  it.each<{ value: Array<number>; threshold: number }>([
    { value: [], threshold: 0 },
    { value: [1, 2], threshold: 1 },
    { value: [], threshold: -1 },
  ])('array:params:%j: valid', ({ value, threshold }) => {
    const validate = array(min(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: Array<number>; threshold: number }>([
    { value: [1, 2], threshold: 3 },
    { value: [], threshold: 1 },
  ])('array:params:%j: invalid', ({ value, threshold }) => {
    const validate = array(min(threshold));

    const error = validate(value);

    expect(error?.code).toBe(ARRAY_MIN_ERROR_CODE);
  });
});
