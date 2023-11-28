import { expect } from 'vitest';

import { positiveNumber } from './positiveNumber';
import { POSITIVE_NUMBER_ERROR_INFO } from './constants';

describe('positiveNumber', () => {
  it.each<number>([3, 17, 5, 24.7])('Значение "%s" валидно', (value) => {
    const validate = positiveNumber();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<number>([-10, 0, -3.14])('Значение "%s" не валидно', (value) => {
    const validate = positiveNumber();
    const error = validate(value);

    expect(error?.cause.code).toEqual(POSITIVE_NUMBER_ERROR_INFO.code);
  });

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';
    const validate = positiveNumber({ message: customMessage });
    const error = validate(0);

    expect(error?.message).toBe(customMessage);
  });
});
