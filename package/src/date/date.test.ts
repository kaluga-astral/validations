import { createErrorCode } from '../core';
import { date } from '../date';
import { min } from '../min';

import { DATE_TYPE_ERROR_INFO, INVALID_DATE_ERROR_INFO } from './constants';

describe('date', () => {
  it.each<unknown>(['string', {}, Symbol(), 22, NaN])(
    'Value "%s" невалидно',
    (value) => {
      const error = date()(value);

      expect(error?.cause.code).toBe(DATE_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), new Date('01.01.2000')])(
    'Value "%s" валидно',
    (value) => {
      const result = date()(value);

      expect(result).toBeUndefined();
    },
  );

  it('Invalid Date обрабатывается отдельно', () => {
    const value = new Date('Invalid Date');

    const error = date()(value);

    expect(error?.cause.code).toBe(INVALID_DATE_ERROR_INFO.code);
  });

  it('Для переданных rules выполняется композиция', () => {
    const validate = date(min(new Date()), (_, ctx) =>
      ctx.createError({
        message: 'custom error',
        code: createErrorCode('error'),
      }),
    );
    const error = validate(new Date());

    expect(error?.message).toBe('custom error');
  });
});
