import { expect } from 'vitest';

import { integer } from './integer';
import { INTEGER_ERROR_INFO } from './constants';

describe('integer', () => {
  it.each<number>([3, 17, 5, 24])('Значение "%s" валидно', (value) => {
    const validate = integer();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<number>([5.2, 7.55, 3.14])('Значение "%s" не валидно', (value) => {
    const validate = integer();
    const error = validate(value);

    expect(error?.cause.code).toEqual(INTEGER_ERROR_INFO.code);
  });

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';
    const validate = integer({ message: customMessage });
    const error = validate(0.5);

    expect(error?.message).toBe(customMessage);
  });
});
