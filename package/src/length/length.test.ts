import { expect } from 'vitest';

import { string } from '../string';

import { STRING_LENGTH_ERROR_CODE } from './constants';
import { length } from './length';

describe('length', () => {
  it.each<{ value: string; quantity: number }>([
    { value: 'aaa', quantity: 3 },
    { value: '12345', quantity: 5 },
    { value: 'abc123', quantity: 6 },
    { value: ' a b c ', quantity: 5 },
  ])('length:params:%j: valid', ({ value, quantity }) => {
    const validate = string(length(quantity));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: string; quantity: number }>([
    { value: 'aaa', quantity: 4 },
    { value: '12345', quantity: -1 },
    { value: 'abc123', quantity: 2 },
    { value: ' a b c ', quantity: 7 },
  ])('length:params:%j: invalid', ({ value, quantity }) => {
    const validate = string(length(quantity));

    const error = validate(value);

    expect(error?.cause.code).toBe(STRING_LENGTH_ERROR_CODE);
  });

  it('params.message: переопределение message', () => {
    const validate = string(length(5, { message: 'my message' }));

    const error = validate('abc123');

    expect(error?.message).toBe('my message');
  });
});
