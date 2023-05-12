import { expect } from 'vitest';

import { string } from '../string';
import { array } from '../array';
import { date } from '../date';

import {
  ARRAY_MIN_ERROR_CODE,
  DATE_MIN_ERROR_CODE,
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

      expect(error?.cause.code).toBe(STRING_MIN_ERROR_CODE);
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

    expect(error?.cause.code).toBe(NUMBER_MIN_ERROR_CODE);
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

    expect(error?.cause.code).toBe(ARRAY_MIN_ERROR_CODE);
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('10.10.2022'), threshold: new Date('09.10.2022') },
    { value: new Date('10.10.2022'), threshold: new Date('10.10.2022') },
    {
      value: new Date('2022-07-21T09:35:31.820Z'),
      threshold: new Date('2022-07-21T08:30:31.820Z'),
    },
  ])('date:params:%j: valid', ({ value, threshold }) => {
    const validate = date(min(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('08.10.2022'), threshold: new Date('09.10.2022') },
  ])('date:params:%j: invalid', ({ value, threshold }) => {
    const validate = date(min(threshold));

    const result = validate(value);

    expect(result?.cause.code).toBe(DATE_MIN_ERROR_CODE);
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('08.10.2022'), threshold: new Date('09.10.2022') },
  ])('date:params:%j: invalid', ({ value, threshold }) => {
    const validate = date(min(threshold));

    const result = validate(value);

    expect(result?.cause.code).toBe(DATE_MIN_ERROR_CODE);
  });

  it('date:message: генерирует ошибку и подставляет в нее min в читаемом формате', () => {
    const validate = date(min(new Date('12.22.2022')));

    const error = validate(new Date('09.09.2022'));

    expect(error?.message).toBe('Не раньше 22.12.2022');
  });
});
