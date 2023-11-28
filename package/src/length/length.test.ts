import { expect } from 'vitest';

import { string } from '../string';

import { STRING_LENGTH_ERROR_CODE } from './constants';
import { length } from './length';

describe('length', () => {
  it.each<{ value: string; len: number }>([
    { value: 'aaa', len: 3 },
    { value: '12345', len: 5 },
    { value: 'abc123', len: 6 },
    { value: ' a b c ', len: 5 },
  ])('Не возвращает ошибку для параметров: %j', ({ value, len }) => {
    const validate = string(length(len));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: string; len: number }>([
    { value: 'aaa', len: 4 },
    { value: '12345', len: -1 },
    { value: 'abc123', len: 2 },
    { value: ' a b c ', len: 7 },
  ])('Возвращает ошибку для параметров: %j', ({ value, len }) => {
    const validate = string(length(len));

    const error = validate(value);

    expect(error?.cause.code).toBe(STRING_LENGTH_ERROR_CODE);
  });

  it('Позволяет переопределить дефолтный message', () => {
    const validate = string(length(5, { message: 'my message' }));

    const error = validate('abc123');

    expect(error?.message).toBe('my message');
  });
});
