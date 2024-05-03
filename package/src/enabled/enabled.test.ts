import { STRING_TYPE_ERROR_INFO, string } from '../string';
import { boolean } from '../boolean';
import { optional } from '../optional';
import { object } from '../object';
import { REQUIRED_ERROR_INFO } from '../core';

import { enabled } from './enabled';

describe('enabled', () => {
  it('Правило валидации используется при is=true', () => {
    const validate = enabled({
      is: () => true,
      then: string(),
    });

    const error = validate(20);

    expect(error?.cause.code).toBe(STRING_TYPE_ERROR_INFO.code);
  });

  it('Правило валидации игнорируется при is=false', () => {
    const validate = enabled({
      is: () => false,
      then: string(),
    });

    const error = validate('string');

    expect(error).toBeUndefined();
  });

  it('Валидация позволяет указывать условные типы для object', () => {
    type Values = { name: string; isAgree: boolean };

    const validate = object<Values>({
      name: enabled({
        is: (_, ctx) => Boolean(ctx.values?.isAgree),
        then: string(),
      }),
      isAgree: optional(boolean()),
    });

    const result1 = validate({ isAgree: false, name: '' });

    expect(result1).toBeUndefined();

    const result2 = validate({ isAgree: true, name: '' });

    expect(result2?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  it('Схема позволяет кастомному правилу возвращать guard', () => {
    const validate = enabled({
      is: () => true,
      then: () => string(),
    });

    const error = validate(20);

    expect(error?.cause.code).toBe(STRING_TYPE_ERROR_INFO.code);
  });
});
