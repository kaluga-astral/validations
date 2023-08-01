import { STRING_TYPE_ERROR_INFO, string } from '../string';
import { NUMBER_TYPE_ERROR_INFO, number } from '../number';
import { boolean } from '../boolean';
import { optional } from '../optional';
import { object } from '../object';
import { any } from '../any';
import { REQUIRED_ERROR_INFO } from '../core';

import { when } from './when';

describe('when', () => {
  it('is=true: запускается ветка правил then', () => {
    const validate = when({
      is: () => true,
      then: string(),
      otherwise: number(),
    });

    const error = validate(20);

    expect(error?.cause.code).toBe(STRING_TYPE_ERROR_INFO.code);
  });

  it('is=false: запускается ветка правил otherwise', () => {
    const validate = when({
      is: () => false,
      then: string(),
      otherwise: number(),
    });

    const error = validate('string');

    expect(error?.cause.code).toBe(NUMBER_TYPE_ERROR_INFO.code);
  });

  it('object: позволяет указывать условные типы', () => {
    type Values = { name: string; isAgree: boolean };

    const validate = object<Values, Values>({
      name: when({
        is: (_, ctx) => Boolean(ctx.values?.isAgree),
        then: string(),
        otherwise: any(),
      }),
      isAgree: optional(boolean()),
    });

    const result1 = validate({ isAgree: false, name: '' });

    expect(result1).toBeUndefined();

    const result2 = validate({ isAgree: true, name: '' });

    expect(result2?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });
});
