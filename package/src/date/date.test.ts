import { ValidationSimpleError, createErrorCode } from '../core';
import { date } from '../date';
import { min } from '../min';

import { DATE_TYPE_ERROR_INFO, INVALID_DATE_ERROR_INFO } from './constants';

describe('date', () => {
  it.each<unknown>(['string', {}, Symbol(), 22, NaN])(
    'Invalid type for: %s',
    (value) => {
      const error = date()(value);

      expect(error?.cause.code).toBe(DATE_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), new Date('01.01.2000')])(
    'Valid for: %s',
    (value) => {
      const result = date()(value);

      expect(result).toBeUndefined();
    },
  );

  it('Для Invalid Date отдельная ошибка', () => {
    const value = new Date('Invalid Date');

    const error = date()(value);

    expect(error?.cause.code).toBe(INVALID_DATE_ERROR_INFO.code);
  });

  it('Выполняет композицию для переданных rules', () => {
    const validate = date(min(0), (_, ctx) =>
      ctx.createError({
        message: 'custom error',
        code: createErrorCode('error'),
      }),
    );
    const error = validate(22);

    expect(error?.message).toBe('custom error');
  });
});
