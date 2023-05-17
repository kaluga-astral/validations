import { expect } from 'vitest';

import { string } from '../string';

import { pattern } from './pattern';
import { PATTERN_ERROR_CODE } from './constants';

describe('pattern', () => {
  it.each<{ value: string; regex: RegExp }>([
    { value: 'abc', regex: /abc/ },
    { value: 'word long word here', regex: /word/g },
    { value: '1234566', regex: /[0-9]/g },
    {
      value: 'test@mail.ru',
      regex: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,}$/,
    },
  ])('params:%s: valid', ({ value, regex }) => {
    const validate = string(pattern(regex));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: string; regex: RegExp }>([
    { value: '123', regex: /abc/ },
    { value: 'ddd1111', regex: /word/g },
    { value: 'abc', regex: /[0-9]/g },
  ])('params:%s: invalid', ({ value, regex }) => {
    const validate = string(pattern(regex));

    const error = validate(value);

    expect(error?.cause.code).toBe(PATTERN_ERROR_CODE);
  });

  it('params.message: позволяет переопределить message', () => {
    const validate = pattern(/abc/, { message: 'my message' });

    const error = validate('123');

    expect(error?.message).toBe('my message');
  });
});
