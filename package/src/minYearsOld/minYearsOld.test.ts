import { expect } from 'vitest';

import { date } from '../date';

import {
  BIRTH_DATE_MAX_ERROR_CODE,
  BIRTH_DATE_MIN_ERROR_CODE,
} from './constants';
import { minYearsOld } from './minYearsOld';

describe('minYearsOld', () => {
  it.each<{ value: Date; age: number }>([
    { value: new Date('10.10.2009'), age: 14 },
    { value: new Date('10.10.2000'), age: 16 },
  ])('date:params:%j: valid', ({ value, age }) => {
    const validate = date(minYearsOld(age));

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<{ value: Date; age: number }>([
    { value: new Date('08.10.2010'), age: 14 },
    { value: new Date('08.10.2010'), age: 16 },
  ])('date:params:%j: invalid', ({ value, age }) => {
    const validate = date(minYearsOld(age));

    const result = validate(value);

    expect(result?.cause.code).toBe(BIRTH_DATE_MAX_ERROR_CODE);
  });

  it.each<{ value: Date; age: number }>([
    { value: new Date('08.10.1099'), age: 14 },
    { value: new Date('08.10.1899'), age: 125 },
  ])('date:params:%j: invalid', ({ value, age }) => {
    const validate = date(minYearsOld(age));

    const result = validate(value);

    expect(result?.cause.code).toBe(BIRTH_DATE_MIN_ERROR_CODE);
  });

  it('date:message: генерирует кастомный текст ошибки', () => {
    const validate = date(
      minYearsOld(18, {
        customErrorMessage:
          'Только совершеннолетние могут воспользоваться данной услугой',
      }),
    );

    const error = validate(new Date('01.22.2023'));

    expect(error?.message).toBe(
      'Только совершеннолетние могут воспользоваться данной услугой',
    );
  });
});
