import { expect } from 'vitest';

import { string } from '../string';
import { array } from '../array';
import { date } from '../date';

import {
  ARRAY_MAX_ERROR_CODE,
  DATE_MAX_ERROR_CODE,
  NUMBER_MAX_ERROR_CODE,
  STRING_MAX_ERROR_CODE,
} from './constants';
import { max } from './max';

describe('max', () => {
  it.each<{ value: string; threshold: number }>([
    { value: 'aaa', threshold: 3 },
    { value: 'a', threshold: 1 },
    { value: 'abc123', threshold: 20 },
  ])('string:params:%j: valid', ({ value, threshold }) => {
    const validate = string(max(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: string; threshold: number }>([
    { value: 'aa', threshold: 1 },
    { value: 'a', threshold: -1 },
    { value: 'aaa123', threshold: 2 },
  ])('string:params:%j: invalid', ({ value, threshold }) => {
    const validate = string(max(threshold));

    const error = validate(value);

    expect(error?.cause.code).toBe(STRING_MAX_ERROR_CODE);
  });

  it.each<{ value: number; threshold: number }>([
    { value: 3, threshold: 3 },
    { value: 0, threshold: 0 },
    { value: 12, threshold: 15 },
  ])('number:params:%j: valid', ({ value, threshold }) => {
    const validate = max(threshold);

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: number; threshold: number }>([
    { value: -1, threshold: -3 },
    { value: 0, threshold: -1 },
    { value: 10, threshold: 9 },
  ])('number:params:%j: invalid', ({ value, threshold }) => {
    const validate = max(threshold);

    const error = validate(value);

    expect(error?.cause.code).toBe(NUMBER_MAX_ERROR_CODE);
  });

  it('params.getMessage: позволяет переопределить message', () => {
    const validate = max(0, { getMessage: () => 'my message' });

    const error = validate(1);

    expect(error?.message).toBe('my message');
  });

  it.each<{ value: Array<number>; threshold: number }>([
    { value: [], threshold: 0 },
    { value: [1, 2], threshold: 3 },
    { value: [1, 2], threshold: 2 },
  ])('array:params:%j: valid', ({ value, threshold }) => {
    const validate = array(max(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: Array<number>; threshold: number }>([
    { value: [1, 2], threshold: 1 },
    { value: [1], threshold: 0 },
  ])('array:params:%j: invalid', ({ value, threshold }) => {
    const validate = array(max(threshold));

    const error = validate(value);

    expect(error?.cause.code).toBe(ARRAY_MAX_ERROR_CODE);
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('10.10.2022'), threshold: new Date('11.11.2023') },
    { value: new Date('10.10.2022'), threshold: new Date('10.10.2022') },
    {
      value: new Date('2022-07-21T09:35:31.820Z'),
      threshold: new Date('2022-07-21T08:30:31.820Z'),
    },
  ])('date:params:%j: valid', ({ value, threshold }) => {
    const validate = date(max(threshold));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('08.10.2022'), threshold: new Date('07.10.2022') },
  ])('date:params:%j: invalid', ({ value, threshold }) => {
    const validate = date(max(threshold));

    const result = validate(value);

    expect(result?.cause.code).toBe(DATE_MAX_ERROR_CODE);
  });

  it.each<{ value: Date; threshold: Date }>([
    { value: new Date('08.10.2022'), threshold: new Date('07.10.2022') },
  ])('date:params:%j: invalid', ({ value, threshold }) => {
    const validate = date(max(threshold));

    const result = validate(value);

    expect(result?.cause.code).toBe(DATE_MAX_ERROR_CODE);
  });

  it('date:message: генерирует ошибку и подставляет в нее max в читаемом формате', () => {
    const validate = date(max(new Date('12.22.2022')));

    const error = validate(new Date('01.22.2023'));

    expect(error?.message).toBe('Не позднее 22.12.2022');
  });
});
